import { CdrCategory, CompanySize, CountryCode } from '@prisma/client'
import { z } from 'zod'
import { validateZodSchema } from '../../errors'
import { map } from 'lodash/fp'
import services from '../../../services'

const base64ImageRegex = /^data:image\/(jpeg|png|jpg|webp|svg|jfif);base64,[A-Za-z0-9+/=]+$/

const createCompanySchema = z.object({
  airTableId: z.string(),
  name: z.string().min(1),
  companyUrl: z.string().url(),
  careerPageUrl: z.string().url(),
  companySize: z.nativeEnum(CompanySize),
  hqCountry: z.nativeEnum(CountryCode),
  cdrCategory: z.nativeEnum(CdrCategory),
  logo: z.string().regex(base64ImageRegex),
}).strict()

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  companyUrl: z.string().url().optional(),
  careerPageUrl: z.string().url().optional(),
  companySize: z.nativeEnum(CompanySize).optional(),
  hqCountry: z.nativeEnum(CountryCode).optional(),
  cdrCategory: z.nativeEnum(CdrCategory).optional(),
  logo: z.string().regex(base64ImageRegex).optional(),
}).strict()

const createCompaniesBodySchema = z.object({
  data: z.object({
    companies: z
      .array(createCompanySchema)
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

const updateCompanyBodySchema = z.object({
  data: z.object({
    company: updateCompanySchema
  }).strict()
}).strict()

const getCompaniesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  lastId: z.string().min(1).optional(),
})

export const validateCreateCompaniesBody = validateZodSchema(createCompaniesBodySchema, true)
export const validateUpdateCompaniesBody = validateZodSchema(updateCompanyBodySchema)
export const validateGetCompaniesQuery = validateZodSchema(getCompaniesQuerySchema)

export type CreateCompaniesBodyType = z.infer<typeof createCompaniesBodySchema>
export type UpdateCompanyBodyType = z.infer<typeof updateCompanyBodySchema>
