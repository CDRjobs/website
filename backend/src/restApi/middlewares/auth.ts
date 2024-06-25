import { Context, Next } from 'koa'
import config from '../../config'

const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.substring(7)
  if (token !== config.api.token) {
    ctx.status = 403
    return
  }

  await next()
}

export default authMiddleware