export type Pagination = {
  limit: number
  takeAfter?: string
  countAfter?: string
}

export type Filters = {
  country?: string
  discipline?: string
  cdrCategory?: string[]
  companySize?: string[]
  remote?: string[]
  seniority?: string[]
  contractType?: string[]
}