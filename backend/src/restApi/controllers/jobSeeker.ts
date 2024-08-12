import { Context } from 'koa'
import { validateCreateJobSeekerBody, CreateJobSeekerBodyType, UpdateJobSeekerBodyType, validateUpdateJobSeekerBody } from './validation/jobSeeker'
import services from '../../services'
import { ValidationError } from '../errors'

export const getJobSeekers = async (ctx: Context) => {
  const jobSeekers = await services.jobSeeker.getAllJobSeekers()

  ctx.body = {
    data: jobSeekers,
  }
}

export const createJobSeeker = async (ctx: Context) => {
  const body = ctx.request.body as CreateJobSeekerBodyType

  await validateCreateJobSeekerBody(body)

  const createdJobSeeker = await services.jobSeeker.createJobSeeker(body.data.jobSeeker)

  ctx.body = {
    data: createdJobSeeker,
  }
}

export const updateJobSeeker = async (ctx: Context) => {
  const body = ctx.request.body as UpdateJobSeekerBodyType
  const { id } = ctx.params
  const currentJobSeeker = await services.jobSeeker.getJobSeekerById(id)

  if (!currentJobSeeker) {
    throw new ValidationError("The job seeker you are trying to update doesn't exist. Please, verify the id.")
  }

  await validateUpdateJobSeekerBody(body)

  const updatedJobSeeker = await services.jobSeeker.updateJobSeeker(id, body.data.jobSeeker)

  ctx.body = {
    data: updatedJobSeeker
  }

}