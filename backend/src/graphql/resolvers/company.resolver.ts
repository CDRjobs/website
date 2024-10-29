import { QuerySearchCompaniesArgs } from '../../types/graphql'
import services from '../../services'
import { validateSearchCompaniesParams } from '../validation/company'

const resolvers = {
  Query: {
    searchCompanies: async (parent: object, params: Partial<QuerySearchCompaniesArgs>) => {
      // TODO: check client token or domain ? X-Frame-Options ?
      const { clientKey, ids } = await validateSearchCompaniesParams(params)

      const companies = await services.company.searchCompanies(clientKey, ids)

      return {
        data: companies
      }
    },
  },
}

export default resolvers