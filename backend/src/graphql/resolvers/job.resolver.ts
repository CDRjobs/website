import { QuerySearchJobsArgs } from '../../types/graphql'
import { Job } from '@prisma/client'
import services from '../../services'
import { validateSearchJobsParams, validateSearchFeaturedJobsParams } from '../validation/job'

const resolvers = {
  Query: {
    searchJobs: async (parent: object, params: Partial<QuerySearchJobsArgs>) => {
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
    searchFeaturedJobs: async (parent: object, params: Partial<QuerySearchJobsArgs>) => {
      const { clientKey, filters, limit } = await validateSearchFeaturedJobsParams(params)
      const jobs = await services.job.searchFeaturedJobs(clientKey, filters, limit)

      return {
        data: jobs
      }
    },
  },
  Job: {
    publishedAt: (job: Job) => job.publishedAt ? job.publishedAt.toISOString() : job.publishedAt
  }
}

export default resolvers