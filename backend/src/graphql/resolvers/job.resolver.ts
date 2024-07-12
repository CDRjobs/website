import { QuerySearchJobsArgs } from '../../types/graphql'
import services from '../../services'
import { validateGetJobsParams } from '../validation/job'

const resolvers = {
  Query: {
    searchJobs: async (parent: object, params: Partial<QuerySearchJobsArgs>) => {
      // TODO: check client token or domain ? X-Frame-Options ?
      const { filters, pagination } = validateGetJobsParams(params)
      const jobs = await services.job.searchJobs(filters, pagination)
      
      return jobs
    },
  },
}

export default resolvers