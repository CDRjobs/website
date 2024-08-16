import { CountryCode, Prisma } from '@prisma/client'
import services from '..'
import prisma from '../../db/prisma'
import { omit } from 'lodash/fp'

type CreateJobSeekerInput = Omit<Prisma.JobSeekerCreateInput, 'id' | 'locations' | 'createdAt' | 'updatedAt' | 'sentJobsViaEmail'> & {
  createdAt?: string
  updatedAt?: string
  sentJobsViaEmail: {
    id: string
    sentAt: string
  }[]
  locations: {
    country: CountryCode
    city?: string | null
  }[]
}

type UpdateJobSeekerInput = Omit<Prisma.JobSeekerUpdateInput, 'id' | 'widId' | 'email' | 'locations' | 'createdAt' | 'updatedAt' | 'sentJobsViaEmail'> & {
  sentJobsViaEmail?: {
    id: string
    sentAt: string
  }[]
  locations?: {
    country: CountryCode
    city?: string | null
  }[]
}

const getJobSeekerById = async (id: string) => {
  const jobSeeker = await prisma.jobSeeker.findUnique({ where: { id }})

  return jobSeeker
}

const getJobSeekerByWixIdOrEmail = async (wixId: string, email: string) => {
  const jobSeeker = await prisma.jobSeeker.findFirst({
    where: {
      OR: [{
        wixId
      }, {
        email: email.toLowerCase(),
      }]
    }
  })

  return jobSeeker
}

const getAllJobSeekers = async () => {
  const jobSeekers = await prisma.jobSeeker.findMany({ include: { locations: true } })

  return jobSeekers
}

const createJobSeeker = async (jobSeeker: CreateJobSeekerInput) => {
  const locations = await services.location.getOrCreateLocations(jobSeeker.locations)
  const createdJobSeeker = await prisma.jobSeeker.create({
    data: {
      createdAt: new Date(),
      updatedAt: new Date(),
      ...jobSeeker,
      email: jobSeeker.email.toLowerCase(),
      locations: {
        connect: locations.map(l => ({ id: l.id })),
      },
      sentJobsViaEmail: {
        create: jobSeeker.sentJobsViaEmail.map(job => ({ jobId: job.id, sentAt: new Date(job.sentAt) })),
      }
    }
  })

  return createdJobSeeker
}

const updateJobSeeker = async (id: string, jobSeeker: UpdateJobSeekerInput) => {
  const jobSeekerData: Prisma.JobSeekerUpdateInput = omit(['locations', 'sentJobsViaEmail'], jobSeeker)

  if (jobSeeker.locations) {
    const locations = await services.location.getOrCreateLocations(jobSeeker.locations)
    jobSeekerData.locations = {
      set: locations.map(l => ({ id: l.id })),
    }
  }

  if (jobSeeker.sentJobsViaEmail) {
    jobSeekerData.sentJobsViaEmail = {
      deleteMany: {},
      create: jobSeeker.sentJobsViaEmail.map(job => ({ jobId: job.id, sentAt: new Date(job.sentAt) })),
    }
  }

  const updatedJobSeeker = await prisma.jobSeeker.update({
    where: { id },
    data: {
      ...jobSeekerData,
      updatedAt: new Date()
    }
  })

  return updatedJobSeeker
}

export default {
  getJobSeekerById,
  getJobSeekerByWixIdOrEmail,
  getAllJobSeekers,
  createJobSeeker,
  updateJobSeeker,
}