import { ZodError, ZodSchema } from 'zod'

export class ApplicationError extends Error {
  name: string
  message: string
  details: unknown

  constructor(message: string = 'An application error occured', details: unknown = {}) {
    super()
    this.name = 'ApplicationError'
    this.message = message
    this.details = details
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string = 'A validation error occured', details: unknown = {}) {
    super()
    this.name = 'ValidationError'
    this.message = message
    this.details = details
  }
}

export class ZodValidationError extends ValidationError {
  constructor(zodError: ZodError, message?: string) {
    super()
    this.name = 'ValidationError'
    this.message = message || this.message
    this.details = zodError.issues
  }
}

export class InternalError extends Error {
  constructor() {
    super()
    this.name = 'InternalError'
    this.message = 'An internal error occured'
  }
}

export const validateZodSchema = (schema: ZodSchema, isAsync = false) => {
  if (isAsync) {
    return async (input: unknown) => {
      try {
        return await schema.parseAsync(input)
      } catch (e) {
        if (e instanceof ZodError) {
          throw new ZodValidationError(e)
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
        throw new ZodValidationError(e)
      }
      throw e
    }
  }
}