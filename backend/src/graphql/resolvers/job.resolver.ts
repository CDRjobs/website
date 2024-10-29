import { QuerySearchJobsArgs } from '../../types/graphql'
import { Job } from '@prisma/client'
import services from '../../services'
import { validateSearchJobsParams } from '../validation/job'

const resolvers = {
  Query: {
    searchJobs: async (parent: object, params: Partial<QuerySearchJobsArgs>) => {
      // TODO: check client token or domain ? X-Frame-Options ?
      const { clientKey, filters, pagination } = await validateSearchJobsParams(params)
      const { total, jobs } = await services.job.searchJobs(clientKey, filters, pagination)

      return {
        pagination: {
          ...pagination,
          total,
        },
        data: jobs
      }
    },
  },
  Job: {
    publishedAt: (job: Job) => job.publishedAt ? job.publishedAt.toISOString() : job.publishedAt
  }
}

export default resolvers