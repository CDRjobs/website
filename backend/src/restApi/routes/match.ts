import Router from '@koa/router'
import { getMatches } from '../controllers/match'

const addJobSeekerRoutes = (router: Router) => {
  router.get('/matches', getMatches)
}

export default addJobSeekerRoutes