import Router from '@koa/router'
import addCompanyRoutes from './routes/company'
import addJobRoutes from './routes/job'
import addClientRoutes from './routes/client'
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
  addJobRoutes(restApiRouter)
  addClientRoutes(restApiRouter)

  router.use(restApiRouter.routes())
  router.use(restApiRouter.allowedMethods())
}