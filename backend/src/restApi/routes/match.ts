import Router from '@koa/router'
import { getMatches, sendViaEmail } from '../controllers/match'

const addJobSeekerRoutes = (router: Router) => {
  router.get('/matches', getMatches)
  router.post('/matches/send', sendViaEmail)
}

export default addJobSeekerRoutes