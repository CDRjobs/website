import isoLanguages from './iso-languages.json'
import isoCountries from './iso-countries.json'
import isoCurrencies from './iso-currencies.json'
import isoCodesServices from '.'
const { isIsoLanguageCodeValid, isIsoCountryCodeValid, isIsoCurrencyCodeValid } = isoCodesServices

describe('isoLanguages', () => {
  describe('isIsoLanguageCodeValid', () => {
    test.each([
      ['', false],
      ['fr', true],
      ['code-that-doesnt-exist', false]
    ])('%p => %s', (codeChecked, expectedResult) => {
      const result = isIsoLanguageCodeValid(codeChecked)
      expect(result).toBe(expectedResult)
    })

    test('Has 184 languages', () => {
      expect(isoLanguages.length).toBe(184)
    })
  })

  describe('isIsoCountryCodeValid', () => {
    test.each([
      ['', false],
      ['fr', true],
      ['code-that-doesnt-exist', false]
    ])('%p => %s', (codeChecked, expectedResult) => {
      const result = isIsoCountryCodeValid(codeChecked)
      expect(result).toBe(expectedResult)
    })

    test('Has 249 countries', () => {
      expect(isoCountries.length).toBe(249)
    })
  })

  describe('isIsoCurrencyCodeValid', () => {
    test.each([
      ['', false],
      ['eur', true],
      ['code-that-doesnt-exist', false]
    ])('%p => %s', (codeChecked, expectedResult) => {
      const result = isIsoCurrencyCodeValid(codeChecked)
      expect(result).toBe(expectedResult)
    })

    test('Has 177 currencies', () => {
      expect(isoCurrencies.length).toBe(177)
    })
  })
})