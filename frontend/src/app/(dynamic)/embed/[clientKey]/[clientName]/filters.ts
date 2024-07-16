export const verticals = {
  forest: 'Afforestation/Reforestation',
  biomass: 'Biomass Carbon Removal and Storage (BiCRS)',
  directAirCapture: 'Direct Air Carbon Capture and Storage (DACCS)',
  ecosystemServices: 'Ecosystem Services',
  mCdr: 'Marine Carbon Dioxide Removal (mCDR)',
  mineralization: 'Mineralization',
  soil: 'Soil Carbon',
  utilization: 'Utilisation',
}

export const companySizes = {
  xxs: '1-10',
  xs: '11-50',
  s: '51-200',
  m: '201-500',
  l: '501-1000',
  xl: '1001-5000',
  xxl: '5001+',
}

export const afenOnly = {
  yes: 'Yes',
  no: 'No'
}

export const remote = {
  yes: 'Yes',
  hybrid: 'Hybrid',
  no: 'No',
}

export const seniority = {
  entryLevel: 'Entry level (<2 years)',
  earlyStage: 'Early stage (2-5 years)',
  midLevel: 'Mid-level (5-10 years)',
  senior: 'Senior (10-20 years)',
  verySenior: 'Very senior (20+ years)',
}

export const contractTimes = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
}

export const contractNatures = {
  employee: 'Employee',
  volunteer: 'Volunteer',
  contractor: 'Contractor',
  internship: 'Intern',
  paidFellowship: 'Paid Fellowship',
}

export const contractTypes = {
  ...contractTimes,
  ...contractNatures,
}