import { CdrCategory, CompanySize, CountryCode } from '@prisma/client'
import { z } from 'zod'
import { validateZodSchema } from '../../errors'

const companySchema = z.object({
  airTableId: z.string(),
  name: z.string(),
  companyUrl: z.string().url(),
  careerPageUrl: z.string().url(),
  companySize: z.nativeEnum(CompanySize),
  hqCountry: z.nativeEnum(CountryCode),
  cdrCategory: z.nativeEnum(CdrCategory)
}).strict()

const createCompanyBodySchema = z.object({
  data: z.object({
    companies: z.array(companySchema).min(1)
  }).strict()
}).strict()

export const validateCreateCompaniesBody = validateZodSchema(createCompanyBodySchema)

export type CreateCompanyBodyType = z.infer<typeof createCompanyBodySchema>
