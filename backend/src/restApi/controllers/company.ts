import { Context } from 'koa'
import { validateCreateCompaniesBody, CreateCompanyBodyType, validateGetCompaniesQuery } from './validation/company'
import services from '../../services'

export const createCompanies = async (ctx: Context) => {
  const body = ctx.request.body as CreateCompanyBodyType

  await validateCreateCompaniesBody(body)

  const createdCompaniesIds = await services.company.createCompanies(body.data.companies)

  ctx.body = {
    data: createdCompaniesIds
  }
}

export const getCompanies = async (ctx: Context) => {
  const queryArgs = validateGetCompaniesQuery(ctx.query)

  const foundCompanies = await services.company.getAllCompanies(queryArgs)

  ctx.body = {
    data: foundCompanies,
  }
}