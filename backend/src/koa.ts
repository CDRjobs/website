import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import cors from '@koa/cors'
import mount from 'koa-mount'
import serve from 'koa-static'
import config from './config'

export const app = new Koa()
export const router = new Router()

app.keys = config.koa.keys

app.use(cors({
  // origin: // set frontend url ?
  credentials: true
}))
app.use(bodyParser())

app.use(mount('/public', serve(config.public.path)))