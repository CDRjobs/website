import { CountryCode, Location } from '@prisma/client'
import { differenceBy, uniqBy, map } from 'lodash/fp'
import { createId } from '@paralleldrive/cuid2'
import prisma from '../../db/prisma'
import { knex } from '../../db/knex'
import { PrismaClientOrTrx } from '../../types'

const getCountryCityKey = ({ country, city }: { country: CountryCode, city?: string | null }) => `${country};${city ? city.trim().toLowerCase() : ''}`

type LocationInput = {
  country: CountryCode,
  city?: string | null
}

type LocationOutput = Pick<Location, 'id' | 'country' | 'city' | 'countryCityKey'>

const getOrCreateLocations = async (locations: LocationInput[], trx: PrismaClientOrTrx = prisma): Promise<LocationOutput[]> => {
  const locationsWithKey = locations.map(l => ({ ...l, countryCityKey: getCountryCityKey(l) }))
  const uniqLocations = uniqBy('countryCityKey', locationsWithKey)
  const locationsToReturn = []

  const existingLocations = await trx.location.findMany({
    select: { id: true, country: true, city: true, countryCityKey: true },
    where: {
      countryCityKey: { in: map('countryCityKey', uniqLocations) }
    },
  })
  locationsToReturn.push(...existingLocations)

  const locationsToCreate = differenceBy('countryCityKey', uniqLocations, existingLocations)

  if (locationsToCreate.length) {
    // To do : find real coordinates
    const long = 0
    const lat = 0

    const data = locationsToCreate.map(l => ({
      ...l,
      id: createId(),
      country: knex.raw('?::"CountryCode"', [l.country]),
      ...(l.city ? { coordinates: knex.raw('ST_geomFromText(?, 4326)', [`Point(${long} ${lat})`]) } : {})
    }))
  
    const createdLocations = await knex('Location')
      .insert(data)
      .onConflict('countryCityKey').ignore()
      .returning(['id', 'country', 'city', 'countryCityKey'])
      .execWithPrisma(trx) as LocationOutput[]
    locationsToReturn.push(...createdLocations)
  }

  return locationsToReturn as LocationOutput[]
}

export default {
  getOrCreateLocations,
  getCountryCityKey,
}