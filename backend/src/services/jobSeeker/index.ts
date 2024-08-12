import { CountryCode, Prisma } from '@prisma/client'
import services from '..'
import prisma from '../../db/prisma'
import { omit } from 'lodash/fp'

type CreateJobSeekerInput = Omit<Prisma.JobSeekerCreateInput, 'id' | 'locations' | 'createdAt' | 'updatedAt'> & {
  createdAt?: string,
  updatedAt?: string,
  locations: {
    country: CountryCode
    city?: string | null
  }[]
}

type UpdateJobSeekerInput = Omit<Prisma.JobSeekerUpdateInput, 'id' | 'widId' | 'email' | 'locations' | 'createdAt' | 'updatedAt'> & {
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
    }
  })

  return createdJobSeeker
}

const updateJobSeeker = async (id: string, jobSeeker: UpdateJobSeekerInput) => {
  const jobSeekerData: Prisma.JobSeekerUpdateInput = omit(['locations'], jobSeeker)

  if (jobSeeker.locations) {
    const locations = await services.location.getOrCreateLocations(jobSeeker.locations)
    jobSeekerData.locations = {
      set: locations.map(l => ({ id: l.id })),
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