import z from 'zod'
import { paginationSchema } from '../pagination'
import { CdrCategory, CompanySize, ContractNature, ContractTime, CountryCode, Discipline, Remote, Seniority } from '@prisma/client'
import { validateZodSchema } from '../validate'

const getJobsSchema = z.object({
  pagination: paginationSchema.optional(),
  filters: z.object({
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
    contractNature: z.array(z.nativeEnum(ContractNature)).optional(),
    contractTime: z.array(z.nativeEnum(ContractTime)).optional(),
    companySize: z.array(z.nativeEnum(CompanySize)).optional(),
  }).optional()
})

export const validateGetJobsParams = validateZodSchema(getJobsSchema)