import { Remote, CompanySizes, Verticals } from '@/types/globals'
import { map, uniq } from 'lodash/fp'

export type Job = {
  id: string
  title: string
  sourceUrl: string
  disciplines: string[],
  locations: { city?: string, country: string }[]
  remote: Remote
  currency?: string
  minSalary?: number
  maxSalary?: number
  minYearsOfExperience?: number
  guessedMinYearsOfExperience?: number
  publishedAt: string
  contractTypes: string[],
  company: {
    id: string
    name: string
    companySize: CompanySizes
    logoUrl: string
    cdrCategory: Verticals
  }
}

export const getLocationText = (job: Job, short: boolean = false) => {
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region', style: short ? 'short' : 'long' })
  
  let locationText = 'Worldwide'
  if (job.locations.length === 1) {
    const loc = job.locations[0]
    const countryName = countryNames.of(loc.country.toUpperCase()) || ''
    locationText = loc.city ? `${loc.city}, ${countryName}` : countryName
  } else {
    const countries = uniq(map('country', job.locations))
    if (countries.length === 1) {
      locationText = countryNames.of(countries[0].toUpperCase()) || ''
    }
  }

  return locationText
}

export const getSalaryText = (job: Job) => {
  const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency', style: 'short' })

  let salaryText = 'Not Available'
  if (job.minSalary || job.maxSalary) {
    if (job.minSalary && job.maxSalary && job.minSalary !== job.maxSalary) {
      salaryText = `${Math.floor(job.minSalary/1000)}K - ${Math.ceil(job.maxSalary/1000)}K`
    } else {
      const minMaxSign = job.minSalary ? '≥' : '≤'
      salaryText = `${minMaxSign} ${Math.round((job.minSalary! || job.maxSalary!) / 1000)}K`
    }
    salaryText +=  ` (${currencyNames.of(job.currency!.toUpperCase())})`
  }

  return salaryText
}

export const getMinYearsOfExperienceText = (job: Job) => {
  let minYearsOfExperienceText = ''
  if (Number.isInteger(job.minYearsOfExperience)) {
    if (job.minYearsOfExperience === 0) {
      minYearsOfExperienceText = 'Entry level'
    } else if (job.minYearsOfExperience === 1) {
      minYearsOfExperienceText = `≥ ${job.minYearsOfExperience} year`
    } else {
      minYearsOfExperienceText = `≥ ${job.minYearsOfExperience} years`
    }
  } else if (Number.isInteger(job.guessedMinYearsOfExperience)) {
    if (job.guessedMinYearsOfExperience === 0) {
      minYearsOfExperienceText = 'Entry level'
    } else if (job.guessedMinYearsOfExperience === 1) {
      minYearsOfExperienceText = `≥ approx. ${job.guessedMinYearsOfExperience} year`
    } else {
      minYearsOfExperienceText = `≥ approx. ${job.guessedMinYearsOfExperience} years`
    }
  }

  return minYearsOfExperienceText
}