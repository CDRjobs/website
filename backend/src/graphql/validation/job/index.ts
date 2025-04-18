import z from 'zod'
import { paginationSchema } from '../pagination'
import { CdrCategory, CompanySize, ContractType, CountryCode, Discipline, Remote } from '@prisma/client'
import { validateZodSchema } from '../validate'
import services from '../../../services'
import { difference, map, uniq } from 'lodash/fp'

const clientKeySchema = z
  .string()
  .refine(async (clientKey) => {
    const client = await services.client.getClientByIFrameKey(clientKey)
    return !!client
  }, { message: 'clientKey is incorrect, client not found.' })

const filterSchema = z.object({
  openSearchToCountries: z.boolean().optional(),
  location: z.object({
    country: z.nativeEnum(CountryCode).optional(),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      long: z.number().min(-180).max(180),
    }).strict().optional(),
  })
    .strict()
    .optional()
    .refine(
      (location) => !location || Boolean(location.country) !== Boolean(location.coordinates),
      { message: 'country and coordinates cannot be both defined at the same time.' }
    ),
  discipline: z.nativeEnum(Discipline).optional(),
  cdrCategory: z.array(z.nativeEnum(CdrCategory)).optional(),
  requiredExperience: z.array(
    z.object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
    }).refine(({ min, max }) => max >= min, { message: 'max has to be equal or greater than min'})
  ).optional(),
  remote: z.array(z.nativeEnum(Remote)).optional(),
  contractType: z.array(z.nativeEnum(ContractType)).optional(),
  companySize: z.array(z.nativeEnum(CompanySize)).optional(),
  companies: z
    .array(z.string())
    .superRefine(async (companiesIds, ctx) => {
      const uniqCompaniesIds = uniq(companiesIds)
      const companies = await services.company.getCompaniesByIds(uniqCompaniesIds)

      if (companies.length !== uniqCompaniesIds.length) {
        const existingCompaniesIds = map('id', companies)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Some companies don't exist, of id: ${difference(uniqCompaniesIds, existingCompaniesIds)}.`,
        })
      }
    }).optional()
  })

const searchJobsSchema = z.object({
  clientKey: clientKeySchema,
  pagination: paginationSchema.optional(),
  filters: filterSchema.optional(),
})

const searchFeaturedJobsSchema = z.object({
  clientKey: clientKeySchema,
  filters: filterSchema.optional(),
  limit: z.number().positive().optional(),
})

export const validateSearchJobsParams = validateZodSchema(searchJobsSchema, true)
export const validateSearchFeaturedJobsParams = validateZodSchema(searchFeaturedJobsSchema, true)