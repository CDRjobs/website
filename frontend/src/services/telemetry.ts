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
  location?: { coordinates: { long: number, lat: number } }
  discipline?: string
  company?: {
    cdrCategory?: string[]
    companySize?: string[] 
  }
  contractTypes?: string[]
  contractTypesLength: number
  remote?: string[]
  remoteLength: number
  seniority?: string[]
  seniorityLength: number
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