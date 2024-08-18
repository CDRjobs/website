import { Location } from '@prisma/client'
import { compact, groupBy, map } from 'lodash/fp'

const countryNames = new Intl.DisplayNames(['en'], { type: 'region', style: 'long' })

type LocationInput = Pick<Location, 'city' | 'country'>

export const locationsToText = (locations: LocationInput[]) => {
  let text = ''

  if (!locations.length) {
    text = 'worlwide'
  } else {
    const citiesByCountryCode = groupBy('country', locations)
    const locationTexts = []
    for (const countryCode of Object.keys(citiesByCountryCode)) {
      const cities = compact(map('city', citiesByCountryCode[countryCode]))
      if (cities.length) {
        locationTexts.push(`${cities.join(', ')} in ${countryNames.of(countryCode.toUpperCase())}`)
      } else {
        locationTexts.push(countryNames.of(countryCode.toUpperCase()))
      }
    }
    text = locationTexts.join('; ')
  }

  return text
}