import { CountryCode } from '@prisma/client'
import { difference } from 'lodash/fp'
import prisma from '../../db/prisma'
import { PrismaClientOrTrx } from '../../types'

const getOrCreateCountries = async (countriesCode: CountryCode[], trx: PrismaClientOrTrx = prisma) => {
  const existingCountries = await trx.location.findMany({
    select: { id: true, country: true },
    where: {
      // add coordinates: null ?
      city: null,
      country: { in: countriesCode }
    },
  })

  const countriesToCreate = difference(countriesCode, existingCountries.map(c => c.country))

  const createdCountries = await trx.location.createManyAndReturn({
    select: { id: true, country: true },
    data: countriesToCreate.map(c => ({ country: c })),
  })

  return [...existingCountries, ...createdCountries]
}

export default {
  getOrCreateCountries
}