import { CountryCode, CurrencyCode, Discipline, Education, JobStatus, Remote } from '@prisma/client'
import { z } from 'zod'
import { validateZodSchema } from '../../errors'
import { difference, map, uniq } from 'lodash/fp'
import services from '../../../services'

const jobSchema = z.object({
  airTableId: z.string(),
  companyAirTableId: z.string(),
  title: z.string().min(5),
  sourceUrl: z.string().url(),
  discipline: z.nativeEnum(Discipline),
  status: z.nativeEnum(JobStatus),
  description: z.string(),
  locations: z.array(
    z.object({
      country: z.nativeEnum(CountryCode),
      city: z
        .string()
        .min(1)
        .nullish()
        .refine(city => !city || !city.includes(';'), { message: "The city name cannot contains ';' character"}),
    }).strict()
  ),
  remote: z.nativeEnum(Remote),
  currency: z.nativeEnum(CurrencyCode),
  minSalary: z.number().int().nonnegative().nullish(),
  maxSalary: z.number().int().nonnegative().nullish(),
  minYearOfExperience: z.number().int().nonnegative().nullish(),
  minEducation: z.nativeEnum(Education),
  publishedAt: z.string().datetime().nullish(),
  foundAt: z.string().datetime(),
  lastCheckedAt: z.string().datetime(),
})
  .strict()
  .refine(({ minSalary, maxSalary}) => {
    if (minSalary && maxSalary) {
      return minSalary <= maxSalary
    }
    return true
  }, {
    message: 'maxSalary has to be greater than minSalary',
    path: ['maxSalary'],
  })
  .refine(({ locations, remote }) => {
    if (remote === 'yes') {
      return true
    }
    return locations.some(l => l.city)
  }, {
    message: 'A city location is required when remote is hybrid or no',
    path: ['locations'],
  })

const createJobBodySchema = z.object({
  data: z.object({
    jobs: z
      .array(jobSchema)
      .min(1)
      .superRefine(async (jobs, ctx) => {
        const companiesAirTableIds = uniq(map('companyAirTableId', jobs))
        const foundcompanies = await services.company.getCompaniesByAirTableIds(companiesAirTableIds, { airTableId: true })
        const notExistingAirTableIds = difference(companiesAirTableIds, map('airTableId')(foundcompanies))

        if (notExistingAirTableIds.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Some companies don't exist, probably of airTableId: ${notExistingAirTableIds}. Create the companies first and check that the companyAirTableId values are correct.`,
          })
        }
      })
      .superRefine(async (jobs, ctx) => {
        const existingjobs = await services.job.getJobsByAirTableIds(map('airTableId', jobs), { airTableId: true })

        if (existingjobs.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Some jobs already exist, of airTableId: ${map('airTableId', existingjobs)}.`,
          })
        }
      })
  }).strict()
}).strict()

export const validateCreateJobsBody = validateZodSchema(createJobBodySchema, true)

export type CreateJobBodyType = z.infer<typeof createJobBodySchema>
