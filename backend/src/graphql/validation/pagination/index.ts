import z from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  countAfter: z.string().datetime().optional(),
  takeAfter: z.string().datetime().optional(),
}).strict()