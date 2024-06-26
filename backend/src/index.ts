import http from 'http'
import { app, router } from './koa'
import prisma from './db/prisma'
import { addGraphQLServer } from './graphqlServer'
import { addRestServer } from './restApi'

const run = async () => {
  // Check database connection
  try {
    await prisma.$connect()
  } catch (e) {
    throw new Error('Couldn\'t connect to database')
  }

  // Set up graphql server
  const httpServer = http.createServer(app.callback())
  await addGraphQLServer(httpServer, router, '/graphql')

  // Set up rest server
  addRestServer(router, '/api')
  
  app.use(router.routes())

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, () => resolve(undefined)))
  console.log('🚀 Server ready on port 4000')
}

run()
  .catch((e) => console.log(e))