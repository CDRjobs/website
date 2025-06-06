import { z } from 'zod'
import { validateZodSchema } from '../../errors'

const wixWebhookBodySchema = z.object({
  data: z.object({
    email: z.string().trim().email(),
    authToken: z.string(),
    firstname: z.string().trim(),
    didRegisterToNL: z.string().trim(),
  })
}).strict()


export const validateWixWebhookBody = validateZodSchema(wixWebhookBodySchema)

export type WixWebhookBodyType = z.infer<typeof wixWebhookBodySchema>

