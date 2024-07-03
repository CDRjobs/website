import { CountryCode, Location } from '@prisma/client'
import { differenceBy, uniqBy, map } from 'lodash/fp'
import { createId } from '@paralleldrive/cuid2'
import prisma from '../../db/prisma'
import { knex } from '../../db/knex'
import { PrismaClientOrTrx } from '../../types'
import mapbox from '../../lib/mapbox'
import wait from '../../utils/wait'
import { ApplicationError } from '../../restApi/errors'

const getCountryCityKey = ({ country, city }: { country: CountryCode, city?: string | null }) => `${country};${city ? city.trim().toLowerCase() : ''}`

type LocationInput = {
  country: CountryCode,
  city?: string | null
}

type CoordinateMap = {
  [key: string]: {
    long: number
    lat: number
  }
}

type LocationOutput = Pick<Location, 'id' | 'country' | 'city' | 'countryCityKey'>

const getLongLatForCity = async (city: string, country: CountryCode): Promise<{ long: number, lat: number }> => {
  const sessionToken = createId()
  const { suggestions } = await mapbox.suggest(city, {
    sessionToken,
    country,
    language: 'en',
    types: 'city',
    limit: 1,
  })

  if (!suggestions.length) {
    throw new ApplicationError(`Coordinates could not be found for city: ${city} in ${country}`)
  }

  const { features } = await mapbox.retrieve(suggestions[0], { sessionToken })
  const pointFeature = features.find(f => f.geometry.type === 'Point')

  if (!pointFeature) {
    throw new ApplicationError(`Coordinates could not be found for city: ${city} in ${country}`)
  }

  const [long, lat] = pointFeature.geometry.coordinates

  return { long, lat }
}

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
    const coordinatesMap = {} as CoordinateMap
    for (const locToCreate of locationsToCreate) {
      if (locToCreate.city) {
        if (locToCreate !== locationsToCreate[0]) {
          await wait(250) // To not reach mapbox rate limit of 10 requests/sec (here 2 requests are made, I don't know if they count in the same rate limit)
        }
        coordinatesMap[locToCreate.countryCityKey] = await getLongLatForCity(locToCreate.city, locToCreate.country)
      }
    }

    const data = locationsToCreate.map(l => ({
      ...l,
      id: createId(),
      country: knex.raw('?::"CountryCode"', [l.country]),
      ...(l.city ? { coordinates: knex.raw('ST_geomFromText(?, 4326)', [`Point(${coordinatesMap[l.countryCityKey].long} ${coordinatesMap[l.countryCityKey].lat})`]) } : {})
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