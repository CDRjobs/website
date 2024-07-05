import { GraphQLError } from 'graphql'
import { ZodError, ZodSchema } from 'zod'

export const validateZodSchema = (schema: ZodSchema, isAsync = false) => {
  if (isAsync) {
    return async (input: unknown) => {
      try {
        return await schema.parseAsync(input)
      } catch (e) {
        if (e instanceof ZodError) {
          throw new GraphQLError('Validation Error', { extensions: { code: 'BAD_USER_INPUT', details: e.issues } })
        }
        throw e
      }
    }
  }

  return (input: unknown) => {
    try {
      return schema.parse(input)
    } catch (e) {
      if (e instanceof ZodError) {
          throw new GraphQLError('Validation Error', { extensions: { code: 'BAD_USER_INPUT', details: e.issues } })
      }
      throw e
    }
  }
}