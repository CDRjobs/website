import { CdrCategory, CompanySize, ContractNature, ContractTime, CountryCode, Discipline, Job, Prisma, Remote, Seniority } from '@prisma/client'
import pMap from 'p-map'
import services from '..'
import { flatten, map, omit } from 'lodash/fp'
import prisma from '../../db/prisma'

type CreateJobInput = Omit<Prisma.JobCreateInput, 'id' | 'company' | 'locations'> & {
  companyAirTableId: string,
  locations: {
    country: CountryCode
    city?: string | null
  }[]
}

type UpdateJobInput = Omit<Prisma.JobUpdateInput, 'id' | 'airTableId' | 'company' | 'locations'> & {
  locations?: {
    country: CountryCode
    city?: string | null
  }[]
}

type Map = {
  [key: string]: string
}

type SearchFilters = {
  country?: CountryCode
  discipline?: Discipline
  cdrCategory?: CdrCategory[]
  seniority?: Seniority[]
  remote?: Remote[]
  contractNature?: ContractNature[]
  contractTime?: ContractTime[]
  companySize?: CompanySize[]
}

type Pagination = {
  limit?: number
  lastId?: string
}

const getJobByIdWithLocations = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { locations: true },
  })

  return job
}

const getJobsByAirTableIds = async (ids: string[], select: { [key: string]: boolean }) => {
  const companies = await prisma.job.findMany({
    ...(select ? { select } : {}),
    where: {
      airTableId: { in: ids }
    },
  })

  return companies
}

const getAllJobs = async ({ limit, lastId }: Pagination = {}, include?: Prisma.JobInclude)  => {
  const jobs = await prisma.job.findMany({
    ...(include ? { include } : {}),
    orderBy: { id: 'asc' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
  })

  return jobs
}

const searchJobs = async (filters: SearchFilters = {}, { limit, lastId }: Pagination) => {
  const jobFilters = {
    ...(filters.discipline ? { discipline: filters.discipline }: {}),
    ...(filters.seniority ? { seniority: { in: filters.seniority } }: {}),
    ...(filters.remote ? { remote: { in: filters.remote } }: {}),
    ...(filters.contractNature ? { contractNature: { in: filters.contractNature } }: {}),
    ...(filters.contractTime ? { contractTime: { in: filters.contractTime } }: {}),
  }

  const companyFilters = {
    ...(filters.cdrCategory ? { cdrCategory: { in: filters.cdrCategory } }: {}),
    ...(filters.companySize ? { companySize: { in: filters.companySize } }: {}),
  }

  const locationFilters = {
    ...(filters.country ? { country: filters.country }: {}),
  }

  const jobs = await prisma.job.findMany({
    include: { locations: true, company: true },
    where: {
      ...jobFilters,
      company: companyFilters,
      locations: {
        some: locationFilters,
      }
    },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {}),
  })
  
  return jobs
}

const createJobs = async (jobs: CreateJobInput[]) => {
  let createdJobs = [] as Pick<Job, 'id'>[]

  await prisma.$transaction(async (trx) => {
    const locations = await services.location.getOrCreateLocations(flatten(map('locations', jobs)), trx)
    const locationMap = locations.reduce((map, l) => Object.assign(map, { [l.countryCityKey]: l.id }), {}) as Map
    const jobsData = jobs.map(({ companyAirTableId, ...job }) => ({
      ...job,
      locations: {
        connect: job.locations.map(l => ({ id: locationMap[services.location.getCountryCityKey(l)] }))
      },
      company: {
        connect: { airTableId: companyAirTableId },
      },
    }))
  
    const createJob = (jobData: (Prisma.Without<Prisma.JobUncheckedCreateInput, Prisma.JobCreateInput> & Prisma.JobCreateInput)) => {
      return trx.job.create({
       data: jobData,
       select: {
         id: true
       }
     })
    }
  
    createdJobs = await pMap(jobsData, createJob, { concurrency: 10 })
  })

  return map('id', createdJobs)
}

const updateJob = async (id: string, job: UpdateJobInput) => {
  let updatedJob: Job | undefined
  await prisma.$transaction(async (trx) => {
    const jobData: Prisma.JobUpdateInput = omit('locations', job)
    if (job.locations) {
      const locations = await services.location.getOrCreateLocations(job.locations, trx)
      const locationMap = locations.reduce((map, l) => Object.assign(map, { [l.countryCityKey]: l.id }), {}) as Map
      jobData.locations = {
        set: job.locations.map(l => ({ id: locationMap[services.location.getCountryCityKey(l)] }))
      }
    }
  
    updatedJob = await trx.job.update({
      where: { id },
      data: jobData,
    })
  })
  
  return updatedJob || null
}

export default {
  getJobByIdWithLocations,
  getJobsByAirTableIds,
  getAllJobs,
  createJobs,
  updateJob,
  searchJobs,
}