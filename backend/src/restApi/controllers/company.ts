import { Context } from 'koa'
import { validateCreateCompaniesBody, CreateCompaniesBodyType, UpdateCompanyBodyType, validateGetCompaniesQuery, validateUpdateCompaniesBody } from './validation/company'
import services from '../../services'
import { ValidationError } from '../errors'

export const createCompanies = async (ctx: Context) => {
  const body = ctx.request.body as CreateCompaniesBodyType

  await validateCreateCompaniesBody(body)

  const createdCompaniesIds = await services.company.createCompanies(body.data.companies)

  ctx.body = {
    data: createdCompaniesIds
  }
}

export const getCompanies = async (ctx: Context) => {
  const queryArgs = validateGetCompaniesQuery(ctx.query)

  const foundCompanies = await services.company.getAllCompaniesWithHqLocation(queryArgs)

  ctx.body = {
    data: foundCompanies,
  }
}

export const updateCompany = async (ctx: Context) => {
  const body = ctx.request.body as UpdateCompanyBodyType
  const { id } = ctx.params
  const currentJob = await services.company.getCompanyByIdWithLocations(id)

  if (!currentJob) {
    throw new ValidationError("The company you are trying to update doesn't exist. Please, verify the id.")
  }

  validateUpdateCompaniesBody(body)

  const updatedJob = await services.company.updateCompany(id, body.data.company)

  ctx.body = {
    data: updatedJob
  }
}