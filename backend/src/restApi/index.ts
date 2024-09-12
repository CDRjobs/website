import Router from '@koa/router'
import addCompanyRoutes from './routes/company'
import addJobRoutes from './routes/job'
import addJobSeekerRoutes from './routes/jobSeeker'
import addMatchRoutes from './routes/match'
import addClientRoutes from './routes/client'
import addWebhookRoutes from './routes/webhook'
import authMiddleware from './middlewares/auth'
import errorMiddleware from './middlewares/errors'
import rateLimitMiddleware from './middlewares/rateLimit'

const restApiRouter = new Router()

export const addRestServer = (router: Router, path: string) => {
  restApiRouter.prefix(`${path}/v1`)
  restApiRouter.use(errorMiddleware)
  restApiRouter.use(rateLimitMiddleware)
  
  // No auth required
  addWebhookRoutes(restApiRouter)

  restApiRouter.use(authMiddleware)

  // Auth required
  addCompanyRoutes(restApiRouter)
  addJobRoutes(restApiRouter)
  addClientRoutes(restApiRouter)
  addJobSeekerRoutes(restApiRouter)
  addJobSeekerRoutes(restApiRouter)
  addMatchRoutes(restApiRouter)

  router.use(restApiRouter.routes())
  router.use(restApiRouter.allowedMethods())
}