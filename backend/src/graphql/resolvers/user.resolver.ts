import { Context } from 'koa'
import { getUserById, deleteUser } from '../../services/user'
import checkLogin from '../utils/checkLogin'

export default {
  Query: {
    me: async (parent: never, args: never, ctx: Context) => {
      checkLogin(ctx)
      const user = await getUserById(ctx.session!.userId)
      
      return user
    },
  },
  Mutation: {
    deleteAccount: async (parent: never, args: never, ctx: Context) => {
      checkLogin(ctx)
      const user = await deleteUser(ctx.session!.userId)
      
      return user
    },
  }
}