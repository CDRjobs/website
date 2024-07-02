import Router from '@koa/router'
import { createCompanies, getCompanies, updateCompany } from '../controllers/company'

const addCompanyRoutes = (router: Router) => {
  router.get('/companies', getCompanies)
  router.post('/companies', createCompanies)
  router.put('/company/:id', updateCompany)
}

export default addCompanyRoutes