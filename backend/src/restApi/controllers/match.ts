import { Context } from 'koa'
import services from '../../services'
import papaparse from 'papaparse'

export const getMatches = async (ctx: Context) => {
  const matches = await services.match.getMatches({ asCSVString: true })

  const csvString = papaparse.unparse(matches)

  ctx.type = 'text/csv'
  ctx.body = csvString
}