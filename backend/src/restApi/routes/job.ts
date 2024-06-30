import Router from '@koa/router'
import { createJobs } from '../controllers/job'

const addJobRoutes = (router: Router) => {
  router.post('/job', createJobs)
}

export default addJobRoutes