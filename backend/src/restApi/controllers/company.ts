import { Context } from 'koa'
import { validateCreateCompaniesBody, CreateCompaniesBodyType, UpdateCompanyBodyType, validateGetCompaniesQuery, validateUpdateCompaniesBody } from './validation/company'
import services from '../../services'
import { ValidationError } from '../errors'
import { omit } from 'lodash/fp'

export const createCompanies = async (ctx: Context) => {
  const body = ctx.request.body as CreateCompaniesBodyType

  await validateCreateCompaniesBody(body)

  const companiesWithLogoUrl = []
  let createdCompaniesIds: string[] = []
  
  try {
    for (const company of body.data.companies) {
      const logoUrl = await services.company.writeLogoFileAndGetUrl(company.logo, company.name)
      const companyWithLogoUrl = { ...omit('logo', company), logoUrl }
      companiesWithLogoUrl.push(companyWithLogoUrl)
    }
    createdCompaniesIds = await services.company.createCompanies(companiesWithLogoUrl)
  } catch (e) {
    for (const company of companiesWithLogoUrl) {
      await services.company.deleteLogo(company.logoUrl)
    }
    throw e
  }

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
  const currentCompany = await services.company.getCompanyByIdWithLocations(id)

  if (!currentCompany) {
    throw new ValidationError("The company you are trying to update doesn't exist. Please, verify the id.")
  }

  validateUpdateCompaniesBody(body)

  const company = body.data.company

  let companyWithLogoUrl
  let updatedJob

  try {
    if (company.logo) {
      const logoUrl = await services.company.writeLogoFileAndGetUrl(company.logo, company.name || currentCompany.name)
      companyWithLogoUrl = { ...omit('logo', company), logoUrl }
    }

    updatedJob = await services.company.updateCompany(id, companyWithLogoUrl || company)

    if (company.logo) {
      await services.company.deleteLogo(currentCompany.logoUrl)
    }
  } catch (e) {
    if (companyWithLogoUrl?.logoUrl) {
      await services.company.deleteLogo(companyWithLogoUrl.logoUrl)
    }
  }

  ctx.body = {
    data: updatedJob
  }
}