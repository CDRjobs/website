import z from 'zod'
import { validateZodSchema } from '../validate'
import services from '../../../services'

const getClientSchema = z.object({
  clientKey: z
    .string()
    .refine(async (clientKey) => {
      const client = await services.client.getClientByIFrameKey(clientKey)
      return !!client
    }, { message: 'clientKey is incorrect, client not found.' }),
})

export const validateGetClientParams = validateZodSchema(getClientSchema, true)