import Router from '@koa/router'
import { wix } from '../controllers/webhook'

const addWebhookRoutes = (router: Router) => {
  router.post('/webhook/wix', wix)
}

export default addWebhookRoutes