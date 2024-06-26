import Router from '@koa/router'
import addCompanyRoutes from './routes/company'
import authMiddleware from './middlewares/auth'
import errorMiddleware from './middlewares/errors'
import rateLimitMiddleware from './middlewares/rateLimit'

const restApiRouter = new Router()

export const addRestServer = (router: Router, path: string) => {
  restApiRouter.prefix(`${path}/v1`)
  restApiRouter.use(rateLimitMiddleware)
  restApiRouter.use(authMiddleware)
  restApiRouter.use(errorMiddleware)

  addCompanyRoutes(restApiRouter)

  router.use(restApiRouter.routes())
  router.use(restApiRouter.allowedMethods())
}