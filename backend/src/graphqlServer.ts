import http from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { rateLimitDirective } from 'graphql-rate-limit-directive'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground')
import { koaMiddleware } from '@as-integrations/koa'
import Router from '@koa/router'
import { doesUserExist } from './services/user'
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
    plugins
  })

  await server.start()

  router.all(
    path,
    koaMiddleware(server, {
      context: async ({ ctx }) => {
        if (ctx.session?.userId) {
          const exists = doesUserExist(ctx.session?.userId)
          if (!exists) {
            ctx.session = null
          }
        }
  
        return ctx
      },
    }),
  )
}
