import { z } from 'zod'
import { validateZodSchema } from '../../errors'

const wixWebhookBodySchema = z.object({
  data: z.object({
    email: z.string().email(),
    authToken: z.string(),
  }).strict()
}).strict()


export const validateWixWebhookBody = validateZodSchema(wixWebhookBodySchema)

export type WixWebhookBodyType = z.infer<typeof wixWebhookBodySchema>

