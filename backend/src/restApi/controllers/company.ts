import { Context } from 'koa'
import { validateCreateCompaniesBody, CreateCompanyBodyType } from './validation/company'
import services from '../../services'

export const createCompanies = async (ctx: Context) => {
  const body = ctx.request.body as CreateCompanyBodyType

  await validateCreateCompaniesBody(body)

  const createdCompaniesIds = await services.company.createCompanies(body.data.companies)

  ctx.body = {
    data: {
      companies: createdCompaniesIds
    }
  }
}