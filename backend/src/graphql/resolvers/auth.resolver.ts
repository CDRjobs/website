import { Context } from 'koa'
import { Session } from 'koa-session'
import { GraphQLError } from 'graphql'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { addForgetPasswordTokenFor, getUserByEmail, getUserByIdAndForgotPasswordToken, doesUserExist, createUser, getUserByCredentials, updateUserPassword } from '../../services/user'
import { sendForgotPasswordEmail } from '../../services/email'
import config from '../../config'
import concatUrlSegments from '../../utils/concatUrlSegments'

// TODO: to move to proper type files
interface SessionData {
  user?: {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
  }
}

interface ContextWithSession extends Context {
  session: Session & Partial<SessionData>;
}

export default {
  Mutation: {
    register: async (
      parent: never,
      { firstname, lastname, email, password }: { email: string, firstname: string, lastname: string, password: string },
      ctx: ContextWithSession
    ) => {
      const alreadyExists = await doesUserExist(email)

      if (alreadyExists) {
        throw new GraphQLError('Already exists', { extensions: { code: 'BAD_USER_INPUT' } })
      }

      // TODO: validate email and password
      const user = await createUser({ firstname, lastname, email, password })

      ctx.session.userId = user.id

      return user
    },
    login : async (parent: never, { email, password }: { email: string, password: string }, ctx: ContextWithSession) => {
      const user = await getUserByCredentials({ email, password })

      if (user) {
        ctx.session.userId = user.id
      }

      return user
    },
    logout: async (parent: never, args: never, ctx: Context): Promise<boolean> => {
      if (ctx.session?.userId) {
        ctx.session = null
      }

      return true
    },
    forgotPassword: async (parent: never, { email }: { email: string }, ctx: Context): Promise<boolean> => {
      // execute without waiting in order to always have the same response time (security)
      (async () => {
        const user = await getUserByEmail(email)
        if (user) {
          try {
            const { forgotPasswordToken } = await addForgetPasswordTokenFor(user.id)
            const link = concatUrlSegments(config.forgotPassword.resetUrl, user.id, forgotPasswordToken!)
            if (process.env.NODE_ENV === 'production') {
              await sendForgotPasswordEmail(user.email, { firstname: user.firstname, link })
            } else {
              console.log(`Email is disabled when not in production. Reset link for ${user.email}:`, link)
            }
          } catch (e) {
            // TO DO : add sentry
            console.error('forgot password error:', e);
            // silent error
          }
        }
      })()

      return true
    },
    resetPassword: async (parent: never, { password, userId, token }: { password: string, userId: string, token: string }) => {
      try {
        const { name, expire } = jwt.verify(token, config.jwt.key) as JwtPayload // will throw if not valid
        
        const user = await getUserByIdAndForgotPasswordToken({ id: userId, token })
  
        if (!user || name !== 'Reset password' || (new Date(expire) < new Date())) {
          throw new Error()
        }
      } catch (e) {
        throw new GraphQLError('Invalid token', { extensions: { code: 'BAD_USER_INPUT' } })
      }

      const newUser = await updateUserPassword(userId, password)

      return newUser
    }
  }
}