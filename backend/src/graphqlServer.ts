import http from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { rateLimitDirective } from 'graphql-rate-limit-directive'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground')
import { koaMiddleware } from '@as-integrations/koa'
import Router from '@koa/router'
import { typeDefs, resolvers } from './graphql'

export const addGraphQLServer = async (httpServer: http.Server, router: Router, path: string) => {
  const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective()

  const schema = makeExecutableSchema({
    typeDefs: [rateLimitDirectiveTypeDefs, typeDefs],
    resolvers,
  })

  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })]

  if (process.env.NODE_ENV !== 'production') {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground())
  }

  const server = new ApolloServer({
    schema: rateLimitDirectiveTransformer(schema),
    plugins,
    formatError: (formattedError, error) => {
      console.error('Graphql error:')
      console.error(error)
  
      return formattedError
    },
  })

  await server.start()

  router.all(
    path,
    koaMiddleware(server),
  )
}
