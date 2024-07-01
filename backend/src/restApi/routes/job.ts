import Router from '@koa/router'
import { createJobs, getJobs, updateJob } from '../controllers/job'

const addJobRoutes = (router: Router) => {
  router.get('/jobs', getJobs)
  router.post('/jobs', createJobs)
  router.put('/job/:id', updateJob)
}

export default addJobRoutes