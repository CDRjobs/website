import z from 'zod'
import { validateZodSchema } from '../validate'
import services from '../../../services'
import { difference, map, uniq } from 'lodash/fp'

const searchCompaniesSchema = z.object({
  clientKey: z
    .string()
    .refine(async (clientKey) => {
      const client = await services.client.getClientByIFrameKey(clientKey)
      return !!client
    }, { message: 'clientKey is incorrect, client not found.' }),
  ids: z
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
  })
})

export const validateSearchCompaniesParams = validateZodSchema(searchCompaniesSchema, true)