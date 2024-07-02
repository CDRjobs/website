import Router from '@koa/router'
import { createCompanies, getCompanies } from '../controllers/company'

const addCompanyRoutes = (router: Router) => {
  router.get('/companies', getCompanies)
  router.post('/companies', createCompanies)
}

export default addCompanyRoutes