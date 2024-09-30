import path from 'node:path'
import fs from 'node:fs'
import http from 'http'
import { app, router } from './koa'
import prisma from './db/prisma'
import { addGraphQLServer } from './graphqlServer'
import { addRestServer } from './restApi'
import config from './config'

export class Server {
  private httpServer: http.Server

  constructor() {
    this.httpServer = http.createServer(app.callback())
  }

  async start() {
    // Create necessary directories
    const dir = path.join(config.public.path, config.public.imageFolder)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Check database connection
    try {
      await prisma.$connect()
    } catch (e) {
      throw new Error(`Couldn't connect to database: ${e}`)
    }

    // Set up graphql server
    await addGraphQLServer(this.httpServer, router, '/graphql')

    // Set up rest server
    addRestServer(router, '/api')
    
    app.use(router.routes())

    await new Promise((resolve) => this.httpServer.listen({ port: 4000 }, () => resolve(undefined)))
    console.log('🚀 Server ready on port 4000')
  }

  async stop() {
    await prisma.$disconnect()
    await new Promise<void>((resolve) => {
      this.httpServer.close(() => {
        console.log('💤 Server shut down')
        resolve()
      })
    })
    
  }
}