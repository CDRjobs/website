import z from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  start: z.coerce.number().int().nonnegative().optional(),
}).strict()