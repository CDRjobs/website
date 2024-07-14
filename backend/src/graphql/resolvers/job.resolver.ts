import { QuerySearchJobsArgs } from '../../types/graphql'
import { Job } from '@prisma/client'
import services from '../../services'
import { validateGetJobsParams } from '../validation/job'

const resolvers = {
  Query: {
    searchJobs: async (parent: object, params: Partial<QuerySearchJobsArgs>) => {
      // TODO: check client token or domain ? X-Frame-Options ?
      const { filters, pagination } = validateGetJobsParams(params)
      const { total, jobs } = await services.job.searchJobs(filters, pagination)

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