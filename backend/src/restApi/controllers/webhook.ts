import { Context } from 'koa'
import services from '../../services'
import { validateWixWebhookBody, WixWebhookBodyType } from './validation/webhook'
import config from '../../config'
import { ForbiddenError } from '../errors'

export const wix = async (ctx: Context) => {
  const body = ctx.request.body as WixWebhookBodyType

  if (body?.data?.authToken !== config.webhook.token) {
    throw new ForbiddenError()
  }

  validateWixWebhookBody(body)
 
  await services.email.sendReportEmail({ to: body.data.email.trim() })

  console.log(`sent report to ${body.data.email}`)

  ctx.status = 200
}