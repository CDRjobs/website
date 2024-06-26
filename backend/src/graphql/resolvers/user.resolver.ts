import { Context } from 'koa'
import services from '../../services'
import checkLogin from '../utils/checkLogin'

export default {
  Query: {
    me: async (parent: never, args: never, ctx: Context) => {
      checkLogin(ctx)
      const user = await services.user.getUserById(ctx.session!.userId)
      
      return user
    },
  },
  Mutation: {
    deleteAccount: async (parent: never, args: never, ctx: Context) => {
      checkLogin(ctx)
      const user = await services.user.deleteUser(ctx.session!.userId)
      
      return user
    },
  }
}