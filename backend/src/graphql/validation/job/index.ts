import z from 'zod'
import { paginationSchema } from '../pagination'
import { CdrCategory, CompanySize, ContractType, CountryCode, Discipline, Remote, Seniority } from '@prisma/client'
import { validateZodSchema } from '../validate'
import services from '../../../services'

const getJobsSchema = z.object({
  clientKey: z
    .string()
    .refine(async (clientKey) => {
      const client = await services.client.getClientByIFrameKey(clientKey)
      return !!client
    }, { message: 'clientKey is incorrect, client not found.' }),
  pagination: paginationSchema.optional(),
  filters: z.object({
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
    seniority: z.array(z.nativeEnum(Seniority)).optional(),
    remote: z.array(z.nativeEnum(Remote)).optional(),
    contractType: z.array(z.nativeEnum(ContractType)).optional(),
    companySize: z.array(z.nativeEnum(CompanySize)).optional(),
  }).optional()
})

export const validateGetJobsParams = validateZodSchema(getJobsSchema, true)