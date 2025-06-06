import { CdrCategory, CompanySize, ContractType, CountryCode, Discipline, Job, Prisma, Remote } from '@prisma/client'
import { flatten, map, omit, isEmpty, keyBy } from 'lodash/fp'
import pMap from 'p-map'
import services from '..'
import { knex } from '../../db/knex'
import prisma from '../../db/prisma'
import { ApplicationError } from '../../restApi/errors'

type CreateJobInput = Omit<Prisma.JobCreateInput, 'id' | 'company' | 'locations' | 'createdAt' | 'updatedAt'> & {
  companyAirTableId: string,
  locations: {
    country: CountryCode
    city?: string | null
  }[]
}

type UpdateJobInput = Omit<Prisma.JobUpdateInput, 'id' | 'airTableId' | 'company' | 'locations' | 'createdAt' | 'updatedAt'> & {
  companyAirTableId?: string,
  locations?: {
    country: CountryCode
    city?: string | null
  }[]
}

type Map = {
  [key: string]: string
}

type SearchFilters = {
  openSearchToCountries?: boolean,
  location?: {
    country?: CountryCode
    coordinates?: {
      lat: number
      long: number
    }
  }
  discipline?: Discipline
  cdrCategory?: CdrCategory[]
  requiredExperience?: {
    min: number,
    max: number,
  }[]
  remote?: Remote[]
  contractType?: ContractType[]
  companySize?: CompanySize[]
  companies?: string[]
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

interface JobInclude {
  locations?: boolean | Prisma.Job$locationsArgs
  company?: boolean | Prisma.CompanyDefaultArgs
}

const getJobByIdWithLocations = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { locations: true },
  })

  return job
}

// Cannot have an optional include because of Prisma issue: https://github.com/prisma/prisma/issues/20816
const getJobsByIds = async (ids: string[], { locations = false, company = false }: JobInclude = {}) => {
  const jobs = await prisma.job.findMany({
    where: { id: { in: ids } },
    include: { locations, company }
  })

  return jobs
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

const getAllOpenJobs = async ({ limit, lastId }: CursorPagination = {}, include?: Prisma.JobInclude)  => {
  const jobs = await prisma.job.findMany({
    ...(include ? { include } : {}),
    orderBy: { id: 'asc' },
    where: { status: 'open' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
  })

  return jobs
}

const applySearchQueryWithFilters = async (clientKey: string, filters: SearchFilters) => {
  const client = await prisma.client.findUnique({
    include: { companies: { select: { id: true } } },
    where: { iFrameKey: clientKey },
  })

  if (!client) {
    throw new ApplicationError('Client not found')
  }

  const query = knex('Job as job')
    .leftJoin('Company as c', 'c.id', 'job.companyId')
    .leftJoin('_JobToLocation as pivotL', 'pivotL.A', 'job.id')
    .leftJoin('Location as l', 'l.id', 'pivotL.B')
    .where('job.status', '=', knex.raw('?::"JobStatus"', ['open']))

  if (!isEmpty(filters.companies)) {
    // @ts-expect-error Knex typing doesn't work correctly
    query.whereIn(['companyId'], filters.companies)
  }

  if (!isEmpty(filters.discipline)) {
    query.where(knex.raw('?::"Discipline" = ANY("disciplines")', [filters.discipline]))
  }

  if (!isEmpty(filters.requiredExperience)) {
    query.where(builder => {
      filters.requiredExperience?.forEach(({ min, max }) => {
        builder.orWhere(builder2 => {
          builder2.where('minYearsOfExperience', '>=', min)
          builder2.where('minYearsOfExperience', '<=', max)
        })
        builder.orWhere(builder2 => {
          builder2.where('guessedMinYearsOfExperience', '>=', min)
          builder2.where('guessedMinYearsOfExperience', '<=', max)
        })
      })
    })
  }

  if (!isEmpty(filters.remote)) {
    query.whereIn('remote', filters.remote!.map(r => knex.raw('?::"Remote"', [r])))
  }

  if (!isEmpty(filters.contractType)) {
    query.where(builder => {
      filters.contractType?.forEach(contractType => builder.orWhere(knex.raw('?::"ContractType" = ANY("contractTypes")', [contractType])))
    })
  }

  if (!isEmpty(filters.cdrCategory) || !isEmpty(filters.companySize)) {
    if (!isEmpty(filters.cdrCategory)) {
      query.whereIn('c.cdrCategory', filters.cdrCategory!.map(cc => knex.raw('?::"CdrCategory"', [cc])))
    }
    if (!isEmpty(filters.companySize)) {
      query.whereIn('c.companySize', filters.companySize!.map(cc => knex.raw('?::"CompanySize"', [cc])))
    }
  }

  if (!isEmpty(filters.location)) {
    if (filters.location.coordinates) {
      const { lat, long } = filters.location.coordinates
      query.andWhere((builder) => {
        builder.where(knex.raw('ST_DWithin(l.coordinates::geography, ST_geomFromText(?, 4326)::geography, 80000)', [`Point(${long} ${lat})`]))
        builder.orWhereNull('l.id')
      })
    } else if (filters.location.country) {
      query.andWhere((builder) => {
        builder.where('l.country', knex.raw('?::"CountryCode"', [filters.location!.country]))
        builder.orWhereNull('l.id')
      })
    }
  }

  const companiesIdsToInclude = map('id', client.companies)
  const countriesToIncludes = client.countries

  if (!client.showAllJobs) {
    query.where((builder) => {
      builder.whereIn('c.id', companiesIdsToInclude)
      if (filters.openSearchToCountries !== false && countriesToIncludes.length) {
        builder.orWhereIn('l.country', countriesToIncludes.map(countryCode => knex.raw('?::"CountryCode"', [countryCode])))
      }
    })
  }

  return { query }
}

const searchFeaturedJobs = async (clientKey: string, filters: SearchFilters = {}, limit: number) => {
  const { query } = await applySearchQueryWithFilters(clientKey, filters)

  const mainquery = knex()
    .from(
      query
        .select('job.id as id')
        .distinct()
        .where('isFeatured', true)
        .groupBy('job.id')
    )
    .orderByRaw('gen_random_uuid()')
    .limit(limit)

  const jobsToFind = await mainquery.execWithPrisma(prisma) as { id: string }[]

  const jobs = await prisma.job.findMany({
    include: { locations: true, company: true },
    where: { id: { in: map('id', jobsToFind) } },
  })

  const jobsById = keyBy('id', jobs)

  // Using the order of jobsToFind as jobs seems to be sorted automatically by id
  return jobsToFind.map(({ id }) => jobsById[id])
}

const searchJobs = async (clientKey: string, filters: SearchFilters = {}, { limit, countAfter, takeAfter }: Pagination) => {
  const { query } = await applySearchQueryWithFilters(clientKey, filters)

  const countQuery = query.clone().count(knex.raw('DISTINCT "job"."id"'))

  if (countAfter) {
    countQuery.where('publishedAt', '<=', new Date(countAfter))
  }

  if (takeAfter) {
    query.where('publishedAt', '<', new Date(takeAfter))
  }

  const jobsToFind = await query.select('job.id as id').distinct().execWithPrisma(prisma) as { id: string }[]
  const jobs = await prisma.job.findMany({
    include: { locations: true, company: true },
    where: { id: { in: map('id', jobsToFind) } },
    orderBy: [{ publishedAt: 'desc' }],
    ...(limit ? { take: limit } : {}),
  })
  const [{ count: bigIntTotal }] = await countQuery.execWithPrisma(prisma) as { count: number}[]
  
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
  
    const createdJob = (jobData: (Prisma.Without<Prisma.JobUncheckedCreateInput, Prisma.JobCreateInput> & Prisma.JobCreateInput)) => {
      return trx.job.create({
       data: {
        ...jobData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
       select: {
         id: true
       }
     })
    }
  
    createdJobs = await pMap(jobsData, createdJob, { concurrency: 10 })
  })

  return map('id', createdJobs)
}

const updateJob = async (id: string, job: UpdateJobInput) => {
  let updatedJob: Job | undefined
  await prisma.$transaction(async (trx) => {
    const jobData: Prisma.JobUpdateInput = omit(['locations', 'companyAirTableId'], job)
    if (job.locations) {
      const locations = await services.location.getOrCreateLocations(job.locations, trx)
      const locationMap = locations.reduce((map, l) => Object.assign(map, { [l.countryCityKey]: l.id }), {}) as Map
      jobData.locations = {
        set: job.locations.map(l => ({ id: locationMap[services.location.getCountryCityKey(l)] }))
      }
    }

    if (job.companyAirTableId) {
      jobData.company = {
        connect: { airTableId: job.companyAirTableId },
      }
    }
  
    updatedJob = await trx.job.update({
      where: { id },
      include: { locations: true },
      data: {
        ...jobData,
        updatedAt: new Date(),
      },
    })
  })
  
  return updatedJob || null
}

export default {
  getJobsByIds,
  getJobsByPublishedAt,
  getJobByIdWithLocations,
  getJobsByAirTableIds,
  getAllOpenJobs,
  createJobs,
  updateJob,
  searchJobs,
  searchFeaturedJobs,
}