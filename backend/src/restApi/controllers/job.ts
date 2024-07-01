import { Context } from 'koa'
import { CreateJobBodyType, UpdateJobBodyType, validateCreateJobsBody, validateUpdateBody } from './validation/job'
import services from '../../services'
import { ValidationError } from '../errors'

export const createJobs = async (ctx: Context) => {
  const body = ctx.request.body as CreateJobBodyType

  await validateCreateJobsBody(body)

  const createdJobsIds = await services.job.createJobs(body.data.jobs)

  ctx.body = {
    data: {
      jobs: createdJobsIds
    }
  }
}

export const updateJob = async (ctx: Context) => {
  const body = ctx.request.body as UpdateJobBodyType
  const { id } = ctx.params
  const currentJob = await services.job.getJobByIdWithLocations(id)

  if (!currentJob) {
    throw new ValidationError("The job you are trying to update doesn't exist. Please, verify the id.")
  }

  await validateUpdateBody(currentJob)(body)

  const updatedJob = await services.job.updateJob(id, body.data.job)

  ctx.body = {
    data: updatedJob
  }
}