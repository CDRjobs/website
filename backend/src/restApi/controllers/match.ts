import { Context } from 'koa'
import services from '../../services'

export const getMatches = async (ctx: Context) => {

  const matches = await services.match.getMatches()

  ctx.body = {
    data: matches,
  }
}