import { CountryCode, Job, Prisma } from '@prisma/client'
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

const getJobByIdWithLocations = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { locations: true },
  })

  return job
}

const getJobsByAirTableIds = async (ids: string[], select: { [key: string]: boolean }) => {
  const companies = await prisma.job.findMany({
    where: {
      airTableId: { in: ids }
    },
    ...(select ? { select } : {})
  })

  return companies
}

const getAllJobsWithLocations = async ({ limit, lastId }: { limit?: number, lastId?: string } = {})  => {
  const jobs = await prisma.job.findMany({
    include: { locations: true },
    orderBy: { id: 'asc' },
    ...(lastId ? { where: { id: { gt: lastId }} } : {}),
    ...(limit ? { take: limit } : {})
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
  getAllJobsWithLocations,
  createJobs,
  updateJob,
}