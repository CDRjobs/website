import Router from '@koa/router'
import addCompanyRoutes from './routes/company'
import authMiddleware from './middlewares/auth'

const restApiRouter = new Router()

export const addRestServer = (router: Router, path: string) => {

  addCompanyRoutes(restApiRouter)

  const versionnedPath = `${path}/v1`
  router.use(versionnedPath, authMiddleware)
  router.use(versionnedPath, restApiRouter.routes())
  router.use(versionnedPath, restApiRouter.allowedMethods())
}