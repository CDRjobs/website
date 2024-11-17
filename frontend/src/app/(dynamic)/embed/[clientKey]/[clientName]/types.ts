export type Pagination = {
  limit: number
  takeAfter?: string
  countAfter?: string
}

export type Filters = {
  location?: {
    country?: string
    coordinates?: {
      long: number
      lat: number
    }
  }
  discipline?: string
  cdrCategory?: string[]
  companySize?: string[]
  remote?: string[]
  requiredExperience?: {
    min: number
    max: number
  }[]
  contractType?: string[]
  openSearchToCountries?: boolean
}