import Router from '@koa/router'
import {
  createCompany
} from '../controllers/company'


const getCompanyRoutes = (router: Router) => {
  router.post('/company', createCompany)
}

export default getCompanyRoutes