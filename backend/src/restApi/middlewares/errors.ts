import { Context, Next } from 'koa'

import { ApplicationError, InternalError } from '../errors'

const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof ApplicationError) {
      ctx.body = {
        data: null,
        error: {
          name: error.name,
          message: error.message,
          details: error.details,
        },
      }
      ctx.status = 400
    } else {
      const internalError = new InternalError()
      ctx.body = {
        data: null,
        error: {
          name: internalError.name,
          message: internalError.message,
        },
      }
      ctx.status = 500
      console.error(error)
    }
  }
}

export default errorMiddleware