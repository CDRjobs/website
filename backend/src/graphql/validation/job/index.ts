import z from 'zod'
import { paginationSchema } from '../pagination'
import { CdrCategory, CompanySize, ContractNature, ContractTime, CountryCode, Discipline, Remote, Seniority } from '@prisma/client'
import { validateZodSchema } from '../validate'

const getJobsSchema = z.object({
  pagination: paginationSchema.optional(),
  filters: z.object({
    country: z.nativeEnum(CountryCode).optional(),
    discipline: z.nativeEnum(Discipline).optional(),
    cdrCategory: z.array(z.nativeEnum(CdrCategory)).optional(),
    seniority: z.array(z.nativeEnum(Seniority)).optional(),
    remote: z.array(z.nativeEnum(Remote)).optional(),
    contractNature: z.array(z.nativeEnum(ContractNature)).optional(),
    contractTime: z.array(z.nativeEnum(ContractTime)).optional(),
    companySize: z.array(z.nativeEnum(CompanySize)).optional(),
  }).optional()
})

export const validateGetJobsParams = validateZodSchema(getJobsSchema)