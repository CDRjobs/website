import { CdrCategory, CompanySize, CountryCode } from '@prisma/client'
import { z } from 'zod'
import { validateZodSchema } from '../../errors'
import { map } from 'lodash/fp'
import services from '../../../services'

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
    companies: z
      .array(companySchema)
      .min(1)
      .superRefine(async (companies, ctx) => {
        const existingCompanies = await services.company.getCompaniesByAirTableIds(map('airTableId', companies), { airTableId: true })

        if (existingCompanies.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Some companies already exist, of airTableId: ${map('airTableId', existingCompanies)}.`,
          })
        }
      })
  }).strict()
}).strict()

export const validateCreateCompaniesBody = validateZodSchema(createCompanyBodySchema, true)

export type CreateCompanyBodyType = z.infer<typeof createCompanyBodySchema>
