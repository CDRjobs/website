// Languages : using ISO 639-1
// Countries : using ISO 3166-1 alpha-2
// Currencies : using ISO 4217

import isoLanguages from './iso-languages.json'
import isoCountries from './iso-countries.json'
import isoCurrencies from './iso-currencies.json'

const languageCodes = isoLanguages.map(({ code }: { code: string }) => code)
const countryCodes = isoCountries.map(({ code }: { code: string }) => code)
const currencyCodes = isoCurrencies.map(({ code }: { code: string }) => code)

export const isIsoLanguageCodeValid = (code: string) => languageCodes.includes(code)
export const isIsoCountryCodeValid = (code: string) => countryCodes.includes(code)
export const isIsoCurrencyCodeValid = (code: string) => currencyCodes.includes(code)