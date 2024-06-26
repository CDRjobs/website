// Languages : using ISO 639-1
// Countries : using ISO 3166-1 alpha-2
// Currencies : using ISO 4217

import isoLanguages from './iso-languages.json'
import isoCountries from './iso-countries.json'
import isoCurrencies from './iso-currencies.json'

const languageCodes = isoLanguages.map(({ code }: { code: string }) => code)
const countryCodes = isoCountries.map(({ code }: { code: string }) => code)
const currencyCodes = isoCurrencies.map(({ code }: { code: string }) => code)

const isIsoLanguageCodeValid = (code: string) => languageCodes.includes(code)
const isIsoCountryCodeValid = (code: string) => countryCodes.includes(code)
const isIsoCurrencyCodeValid = (code: string) => currencyCodes.includes(code)

export default {
  isIsoLanguageCodeValid,
  isIsoCountryCodeValid,
  isIsoCurrencyCodeValid
}