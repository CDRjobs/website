import { z } from 'zod'
import { validateZodSchema } from '../../errors'
import { map, difference } from 'lodash/fp'
import services from '../../../services'
import { CountryCode } from '@prisma/client'

const checkCompaniesBySuperRefine = async (companiesIds: string[] | undefined, ctx: z.RefinementCtx) => {
  if (companiesIds) {
    const existingCompanies = await services.company.getCompaniesByIds(companiesIds)
    const missingCompaniesIds = difference(companiesIds, map('id', existingCompanies))

    if (missingCompaniesIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Some companies were not found: ${missingCompaniesIds}.`,
      })
    }
  }
}

const createClientSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine(async (name) => {
      const existingClient = await services.client.getClientByName(name)

      return !existingClient
    }, { message: 'A client with this name already exists.' }),
  companies: z
    .array(z.string())
    .optional()
    .superRefine(checkCompaniesBySuperRefine),
  countries: z.array(z.nativeEnum(CountryCode)).optional(),
  showAllJobs: z.boolean().optional(),
}).strict()

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  companies: z
    .array(z.string())
    .optional()
    .superRefine(checkCompaniesBySuperRefine),
  countries: z.array(z.nativeEnum(CountryCode)).optional(),
  showAllJobs: z.boolean().optional(),
}).strict()

const createClientBodySchema = z.object({
  data: z.object({
    client: createClientSchema
  }).strict()
}).strict()

const updateClientBodySchema = z.object({
  data: z.object({
    client: updateCompanySchema
  }).strict()
}).strict()

export const validateCreateClientBody = validateZodSchema(createClientBodySchema, true)
export const validateUpdateClientBody = validateZodSchema(updateClientBodySchema, true)

export type CreateClientBodyType = z.infer<typeof createClientBodySchema>
export type UpdateClientBodyType = z.infer<typeof updateClientBodySchema>
