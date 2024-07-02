import { CompanySize, CdrCategory, CountryCode, Company } from '@prisma/client'
import prisma from '../../db/prisma'
import services from '../../services'
import { map } from 'lodash/fp'

type CompanyInput = {
  airTableId: string
  name: string
  companyUrl: string
  careerPageUrl: string
  hqCountry: CountryCode
  companySize: CompanySize
  cdrCategory: CdrCategory
}

type CountryMap = {
  [key in CountryCode]: string
}

const getAllCompanies = async ({ limit, lastId }: { limit?: number, lastId?: string } = {})  => {
  const jobs = await prisma.company.findMany({
    orderBy: { id: 'asc' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
  })

  return jobs
}

const getCompaniesByAirTableIds = async (ids: string[], select: { [key: string]: boolean }) => {
  const companies = await prisma.company.findMany({
    where: {
      airTableId: { in: ids }
    },
    ...(select ? { select } : {})
  })

  return companies
}

const createCompanies = async (companies: CompanyInput[]): Promise<string[]> => {
  let createdCompanies = [] as Pick<Company, 'id'>[]
  await prisma.$transaction(async (trx) => {

    const countries = await services.location.getOrCreateLocations(companies.map(c => ({ country: c.hqCountry })), trx)
    const countryMap = countries.reduce((map, c) => Object.assign(map, { [c.country!]: c.id }), {}) as CountryMap
    const companiesData = companies.map(({ hqCountry, ...company }: CompanyInput) => ({
      ...company,
      hqLocationId: countryMap[hqCountry],
    }))
  
    createdCompanies = await trx.company.createManyAndReturn({
      data: companiesData,
      select: {
        id: true
      }
    })
  })

  return map('id', createdCompanies)
}

export default {
  createCompanies,
  getCompaniesByAirTableIds,
  getAllCompanies,
}
