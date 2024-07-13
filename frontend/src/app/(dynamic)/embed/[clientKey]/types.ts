export type SearchJob = {
  id: string
  title: string
  sourceUrl: string
  locations: {
    country: string
    city: string
  }[]
  remote: string
  currency?: string
  minSalary?: number
  maxSalary?: number
  seniority?: string
  publishedAt: string
  company: {
    id: string
    name: string
    companySize: string
    logoUrl: string
    cdrCategory: string
  }
}

export type Pagination = {
  limit: number
  start?: number
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