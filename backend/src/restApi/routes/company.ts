import Router from '@koa/router'
import {
  createCompanies
} from '../controllers/company'


const getCompanyRoutes = (router: Router) => {
  router.post('/company', createCompanies)
}

export default getCompanyRoutes