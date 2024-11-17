import { QueryGetClientArgs } from '../../types/graphql'
import services from '../../services'
import { validateGetClientParams } from '../validation/client'

const resolvers = {
  Query: {
    getClient: async (parent: object, params: Partial<QueryGetClientArgs>) => {
      const { clientKey } = await validateGetClientParams(params)

      const client = await services.client.getClientByIFrameKey(clientKey)

      return {
        data: client
      }
    },
  },
}

export default resolvers