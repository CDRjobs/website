import { requiredExperience } from '@/app/(dynamic)/embed/[clientKey]/[clientName]/filters'
import * as amplitude from '@amplitude/analytics-browser'

type TrackViewJobClickedInput = {
  id: string
  title: string
  sourceUrl: string
  discipline: string[],
  locations: { city?: string, country: string }[]
  remote: string
  currency?: string
  minSalary?: number
  maxSalary?: number
  seniority?: string
  publishedAt: string
  contractTypes: string[],
  company: {
    id: string
    name: string
    companySize: string
    cdrCategory: string
  }
  pageLocation: string
}

type TrackDidSearchInput = {
  isAfen?: boolean
  location?: {
    country?: string
    coordinates?: { long: number, lat: number }
  }
  discipline?: string
  company?: {
    cdrCategory?: string[]
    companySize?: string[] 
  }
  contractTypes?: string[]
  contractTypesLength: number
  remote?: string[]
  remoteLength: number
  requiredExperience?: {
    min: number
    max: number
  }[]
  requiredExperienceLength: number
  totalJobs: number
  totalJobsDisplayed: number
  fromLoadMore: boolean
  pageLocation: string
}

export const trackViewJobClicked = (properties: TrackViewJobClickedInput) => {
  amplitude.track('clickedViewJob', properties)
}

export const trackDidSearch = (properties: TrackDidSearchInput) => {
  amplitude.track('didSearch', properties)
}