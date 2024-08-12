import Router from '@koa/router'
import { createJobSeeker, getJobSeekers, updateJobSeeker } from '../controllers/jobSeeker'

const addJobSeekerRoutes = (router: Router) => {
  router.get('/jobSeekers', getJobSeekers)
  router.post('/jobSeeker', createJobSeeker)
  router.put('/jobSeeker/:id', updateJobSeeker)
}

export default addJobSeekerRoutes