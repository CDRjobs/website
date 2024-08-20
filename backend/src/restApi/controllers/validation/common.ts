import { CountryCode } from '@prisma/client'
import z from 'zod'

export const citySchema = z
  .string()
  .min(1)
  .nullish()
  .refine(city => !city || !city.includes(';'), { message: "The city name cannot contains ';' character"})

export const locationsSchema = z.array(
  z.object({
    country: z.nativeEnum(CountryCode),
    city: citySchema,
  }).strict()
)