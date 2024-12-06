import { QueryGetClientArgs } from '../../types/graphql'
import services from '../../services'
import { validateGetClientParams } from '../validation/client'
import { Client } from '@prisma/client'

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
  Client: {
    key: (client: Client) => client.iFrameKey,
  }
}

export default resolvers