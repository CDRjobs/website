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

export type Verticals = 'directAirCapture' |
'biomass' |
'mineralization' |
'mCdr' |
'soil' |
'forest' |
'utilization' |
'enhancedWeathering' |
'ecosystemServices'

export type VerticalsMap<T> = { [key in Verticals]: T }

export type RequiredExperience =  'min0to2years' |
'min3to5years' |
'min6to9years' |
'min10years'

export type Remote = 'yes' | 'hybrid' | 'no'

export type CompanySizes = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'

export type ContractTypes = 'employeeFT' | 'employeePT' | 'volunteer' | 'contractor' | 'internship' | 'paidFellowship'