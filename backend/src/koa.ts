import Koa from 'koa'
import session from 'koa-session'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import cors from '@koa/cors'
import config from './config'
import prisma from './db/prisma'

const store = {
  get: async (key: string) => {
    const session = await prisma.session.findUnique({ where: { key } })
    
    return session?.data || null
  },

  set: async (key: string, data: object) => {
    await prisma.session.upsert({
      where: { key },
      update: { data },
      create: { key, data }
    })
  },

  destroy: async (key: string) => {
    await prisma.session.delete({ where: { key } })
  }
}

export const app = new Koa()
export const router = new Router()

app.keys = config.koa.keys

const sessionConfig = {
  store,
  maxAge: 2592000000,
  renew: true,
  rolling: true,
  sameSite: false,
}

app.use(session(sessionConfig, app))
app.use(cors({
  // origin: // set frontend url ?
  credentials: true
}))
app.use(bodyParser())