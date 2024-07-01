import Router from '@koa/router'
import { createJobs, updateJob } from '../controllers/job'

const addJobRoutes = (router: Router) => {
  router.post('/jobs', createJobs)
  router.put('/job/:id', updateJob)
}

export default addJobRoutes