import { Prisma } from '@prisma/client'
import { Context } from 'koa'
import { map } from 'lodash/fp'
import { validateCreateCompaniesBody, CreateCompanyBodyType } from './validation/company'
import services from '../../services'
import { ValidationError } from '../errors'

export const createCompanies = async (ctx: Context) => {
  const body = ctx.request.body as CreateCompanyBodyType

  validateCreateCompaniesBody(body)

  const companies = body.data.companies
  let createdCompaniesIds
  try {
    createdCompaniesIds = await services.company.createCompanies(companies)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        const existingCompanies = await services.company.getCompaniesbyAirTableIds(map('airTableId', companies))
        throw new ValidationError(`Some companies already exist, probably of airTableId: ${map('airTableId', existingCompanies)}`)
      }
    }
  }

  ctx.body = {
    data: {
      companies: createdCompaniesIds
    }
  }
}