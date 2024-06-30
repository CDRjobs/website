import { Context } from 'koa'
import { validateCreateJobsBody, CreateJobBodyType } from './validation/job'
import services from '../../services'

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