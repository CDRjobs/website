import { CompanySizes, Remote, RequiredExperience, Verticals, ContractTypes } from '@/types/globals'

export const VERTICAL_SHORT_WORDING: { [key in Verticals]: string } = {
  directAirCapture: 'Direct Air Capture',
  biomass: 'Biomass',
  mineralization: 'Mineralization',
  mCdr: 'Ocean',
  soil: 'Farming',
  forest: 'Forest',
  utilization: 'Utilization',
  enhancedWeathering: 'Enhanced Weathering',
  ecosystemServices: 'Ecosystem Services',
}

export const VERTICAL_MEDIUM_WORDING: { [key in Verticals]: string } = {
  forest: 'Afforestation/Reforestation',
  biomass: 'Biomass Carbon Removal',
  directAirCapture: 'Direct Air Capture ',
  ecosystemServices: 'Ecosystem Services',
  enhancedWeathering: 'Enhanced Weathering',
  mCdr: 'Marine CDR',
  mineralization: 'Mineralization',
  soil: 'Soil Carbon',
  utilization: 'Utilization',
}

export const VERTICAL_LONG_WORDING: { [key in Verticals]: string } = {
  forest: 'Afforestation/Reforestation',
  biomass: 'Biomass Carbon Removal and Storage (BiCRS)',
  directAirCapture: 'Direct Air Carbon Capture and Storage (DACCS)',
  ecosystemServices: 'Ecosystem Services',
  enhancedWeathering: 'Enhanced Weathering',
  mCdr: 'Marine Carbon Dioxide Removal (mCDR)',
  mineralization: 'Mineralization',
  soil: 'Soil Carbon',
  utilization: 'Utilization',
}

export const REMOTE_SHORT_WORDING: { [key in Remote]: string } = {
  yes: 'Yes',
  hybrid: 'Hybrid',
  no: 'No',
}

export const REMOTE_LONG_WORDING: { [key in Remote]: string } = {
  yes: 'Remote',
  hybrid: 'Hybrid',
  no: 'On-site',
}

export const COMPANY_SIZE_WORDING: { [key in CompanySizes]: string } = {
  xxs: '1-10',
  xs: '11-50',
  s: '51-200',
  m: '201-500',
  l: '501-1000',
  xl: '1001-5000',
  xxl: '5001-10000',
  xxxl: '10001+',
}

export const YES_NO_WORDING = {
  yes: 'Yes',
  no: 'No'
}

export const REQUIRED_EXPERIENCE_WORDING: { [key in RequiredExperience]: string } = {
  min0to2years: 'Min. 0-2 years',
  min3to5years: 'Min. 3-5 years',
  min6to9years: 'Min. 6-9 years',
  min10years: 'Min. 10+ years',
}

export const CONTRACT_TYPES_WORDING: { [key in ContractTypes]: string } = {
  employeeFT: 'Full-time Employee',
  employeePT: 'Part-time Employee',
  volunteer: 'Volunteer',
  contractor: 'Contractor',
  internship: 'Intern',
  paidFellowship: 'Paid Fellowship',
}
