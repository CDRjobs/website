import Router from '@koa/router'
import { createCompanies } from '../controllers/company'

const addCompanyRoutes = (router: Router) => {
  router.post('/company', createCompanies)
}

export default addCompanyRoutes