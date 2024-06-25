import { Context } from 'koa'


export const createCompany = (ctx: Context) => {
  ctx.body = {
    ok: true
  }
}