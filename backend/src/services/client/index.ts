import { CountryCode } from '@prisma/client'
import prisma from '../../db/prisma'

type ClientInput = {
  name: string
  companies?: string[]
  countries?: CountryCode[]
  showAllJobs?: boolean
}

type UpdateClientInput = {
  name?: string
  companies?: string[]
  countries?: CountryCode[]
  showAllJobs?: boolean
}

const getClientByIFrameKey = async (iFrameKey: string) => {
  const client = await prisma.client.findUnique({
    where: { iFrameKey },
  })

  return client
}

const getClientById = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id },
  })

  return client
}

const getClientByName = async (name: string) => {
  const client = await prisma.client.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  })

  return client
}

const createClient = async ({ name, companies, countries, showAllJobs }: ClientInput) => {
  const companiesToAdd = companies
    ? { connect: companies.map(id => ({ id })) }
    : null

  const createdClient = await prisma.client.create({
    data: {
      name,
      showAllJobs,
      ...(companiesToAdd ? { companies: companiesToAdd } : {}),
      ...(countries ? { countries: countries } : {})
    },
  })

  return createdClient
}


const updateClient = async (id: string, { name, companies, countries, showAllJobs }: UpdateClientInput) => {
  const companiesToAdd = companies
    ? { set: companies.map(id => ({ id })) }
    : null

  const updatedClient = await prisma.client.update({
    where: { id },
    data: {
      name,
      showAllJobs,
      ...(companiesToAdd ? { companies: companiesToAdd } : {}),
      ...(countries ? { countries: countries } : {}),
    }
  })

  return updatedClient
}

export default {
  getClientByIFrameKey,
  getClientById,
  createClient,
  updateClient,
  getClientByName,
}