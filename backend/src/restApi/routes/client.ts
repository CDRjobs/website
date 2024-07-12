import Router from '@koa/router'
import { createClient, updateClient } from '../controllers/client'

const addCompanyRoutes = (router: Router) => {
  router.post('/client', createClient)
  router.put('/client/:id', updateClient)
}

export default addCompanyRoutes