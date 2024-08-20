import { ContractType } from '@prisma/client'

const contractTypeMap = {
  employeeFT: 'Full-Time',
  employeePT: 'Part-Time',
  volunteer: 'Volunteer',
  contractor: 'Contractor',
  internship: 'Internship',
  paidFellowship: 'Paid Fellowship',
  phdProgram: 'PhD Program',
}

export const toContractTypeText = (contractType: ContractType) => {
  return contractTypeMap[contractType]
}