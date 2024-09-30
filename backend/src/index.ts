import { Server } from './server'

const server = new Server()

server.start()
  .catch((e) => console.error(e))