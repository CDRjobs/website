import { Server } from '../src/server' 

declare global {
  // eslint-disable-next-line no-var
  var __SERVER__: Server
}

export default async () => {
  const server = new Server()
  
  // exposing http server globally to retrieve it in globalTeardown
  global.__SERVER__ = server

  await server.start()
}