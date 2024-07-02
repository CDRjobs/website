import { CompanySize, CdrCategory, CountryCode, Company, Prisma } from '@prisma/client'
import prisma from '../../db/prisma'
import services from '../../services'
import { map, omit } from 'lodash/fp'

type CompanyInput = {
  airTableId: string
  name: string
  companyUrl: string
  careerPageUrl: string
  hqCountry: CountryCode
  companySize: CompanySize
  cdrCategory: CdrCategory
}

type UpdateCompanyInput = Omit<Prisma.CompanyUpdateInput, 'id' | 'airTableId' | 'hqLocation' | 'jobs'> & { hqCountry?: CountryCode }

type CountryMap = {
  [key in CountryCode]: string
}

const getAllCompaniesWithHqLocation = async ({ limit, lastId }: { limit?: number, lastId?: string } = {})  => {
  const jobs = await prisma.company.findMany({
    include: { hqLocation: true },
    omit: { hqLocationId: true },
    orderBy: { id: 'asc' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
  })

  return jobs
}

const getCompanyByIdWithLocations = async (id: string) => {
  const job = await prisma.company.findUnique({
    where: { id },
    include: { hqLocation: true },
  })

  return job
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

const updateCompany = async (id: string, company: UpdateCompanyInput) => {
  let updatedCompany: Omit<Company, 'hqLocationId'> | undefined
  await prisma.$transaction(async (trx) => {
    const companyData: Prisma.CompanyUpdateInput = omit('hqCountry', company)
    if (company.hqCountry) {
      const [location] = await services.location.getOrCreateLocations([{ country: company.hqCountry}], trx)
      companyData.hqLocation = { connect: { id: location.id } }
    }
  
    updatedCompany = await trx.company.update({
      include: { hqLocation: true },
      omit: { hqLocationId: true },
      where: { id },
      data: companyData,
    })
  })
  
  return updatedCompany || null
}

export default {
  createCompanies,
  getCompaniesByAirTableIds,
  getAllCompaniesWithHqLocation,
  updateCompany,
  getCompanyByIdWithLocations,
}
