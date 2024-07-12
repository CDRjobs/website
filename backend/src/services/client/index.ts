import prisma from '../../db/prisma'

type ClientInput = {
  name: string
  companies?: string[]
}

type UpdateClientInput = {
  name?: string
  companies?: string[]
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

const createClient = async (client: ClientInput) => {
  const companies = client.companies
    ? { connect: client.companies.map(id => ({ id })) }
    : null

  const createdClient = await prisma.client.create({
    data: {
      name: client.name,
      ...(companies ? { companies} : {}),
    },
  })

  return createdClient
}


const updateClient = async (id: string, client: UpdateClientInput) => {
  const companies = client.companies
  ? { set: client.companies.map(id => ({ id })) }
  : null

  const updatedClient = await prisma.client.update({
    where: { id },
    data: {
      name: client.name,
      ...(companies ? { companies} : {}),
    }
  })

  return updatedClient
}


export default {
  getClientById,
  createClient,
  updateClient,
  getClientByName,
}