import z from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  lastId: z.string().min(1).optional(),
})