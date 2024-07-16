import { CdrCategory, CompanySize, ContractNature, ContractTime, CountryCode, Discipline, Job, Prisma, Remote, Seniority } from '@prisma/client'
import { flatten, map, omit, isEmpty } from 'lodash/fp'
import pMap from 'p-map'
import services from '..'
import { knex } from '../../db/knex'
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
  location?: {
    country?: CountryCode
    coordinates?: {
      lat: number
      long: number
    }
  }
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
  countAfter?: string
  takeAfter?: string
}

type CursorPagination = {
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

const getJobsByPublishedAt = async (publishedAt: string[]) => {
  const jobs = await prisma.job.findMany({
    where: { publishedAt: { in: publishedAt }}
  })

  return jobs
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

const getAllJobs = async ({ limit, lastId }: CursorPagination = {}, include?: Prisma.JobInclude)  => {
  const jobs = await prisma.job.findMany({
    ...(include ? { include } : {}),
    orderBy: { id: 'asc' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
  })

  return jobs
}

const searchJobs = async (filters: SearchFilters = {}, { limit, countAfter, takeAfter }: Pagination) => {
  const query = knex('Job as job')

  if (!isEmpty(filters.discipline)) {
    query.where('discipline', knex.raw('?::"Discipline"', [filters.discipline]))
  }
  if (!isEmpty(filters.seniority)) {
    query.whereIn('seniority', filters.seniority!.map(s => knex.raw('?::"Seniority"', [s])))
  }
  if (!isEmpty(filters.remote)) {
    query.whereIn('remote', filters.remote!.map(r => knex.raw('?::"Remote"', [r])))
  }
  if (!isEmpty(filters.contractNature)) {
    query.whereIn('contractNature', filters.contractNature!.map(cn => knex.raw('?::"ContractNature"', [cn])))
  }
  if (!isEmpty(filters.contractTime)) {
    query.whereIn('contractTime', filters.contractTime!.map(ct => knex.raw('?::"ContractTime"', [ct])))
  }
  if (!isEmpty(filters.cdrCategory) || !isEmpty(filters.companySize)) {
    query.leftJoin('Company as j1', 'j1.id', 'job.companyId')
    if (!isEmpty(filters.cdrCategory)) {
      query.whereIn('j1.cdrCategory', filters.cdrCategory!.map(cc => knex.raw('?::"CdrCategory"', [cc])))
    }
    if (!isEmpty(filters.companySize)) {
      query.whereIn('j1.companySize', filters.companySize!.map(cc => knex.raw('?::"CompanySize"', [cc])))
    }
  }
  if (!isEmpty(filters.location)) {
    if (filters.location.coordinates) {
      const { lat, long } = filters.location.coordinates
      query.whereIn(
        'job.id',
        knex('_JobToLocation as t1')
          .select('t1.A')
          .innerJoin('Location as j1', 'j1.id', 't1.B')
          .whereNotNull('t1.A')
          .andWhere(
            knex.raw(
              'ST_DWithin(j1.coordinates::geography, ST_geomFromText(?, 4326)::geography, 80000)',
              [`Point(${long} ${lat})`],
            )
          )
      )
    } else if (filters.location.country) {
      query.whereIn(
        'job.id',
        knex('_JobToLocation as t1')
          .select('t1.A')
          .innerJoin('Location as j1', 'j1.id', 't1.B')
          .whereNotNull('t1.A')
          .andWhere('j1.country', knex.raw('?::"CountryCode"', [filters.location.country]))
      )
    }
  }

  const countQuery = query.clone()

  if (countAfter) {
    countQuery.where('publishedAt', '<=', new Date(countAfter))
  }

  if (takeAfter) {
    query.where('publishedAt', '<', new Date(takeAfter))
  }

  const jobsToFind = await query.select('job.id as id').execWithPrisma(prisma) as { id: string }[]
  const jobs = await prisma.job.findMany({
    include: { locations: true, company: true },
    where: { id: { in: map('id', jobsToFind) } },
    orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    ...(limit ? { take: limit } : {}),
  })
  const [{ count: bigIntTotal }] = await countQuery.count().execWithPrisma(prisma) as { count: number}[]
  
  return { total: Number(bigIntTotal), jobs }
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
  getJobsByPublishedAt,
  getJobByIdWithLocations,
  getJobsByAirTableIds,
  getAllJobs,
  createJobs,
  updateJob,
  searchJobs,
}