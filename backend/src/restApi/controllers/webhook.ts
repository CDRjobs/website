import { Context } from 'koa'
import services from '../../services'
import { validateWixWebhookBody, WixWebhookBodyType } from './validation/webhook'
import config from '../../config'
import { ForbiddenError } from '../errors'

export const wix = async (ctx: Context) => {
  const body = ctx.request.body as WixWebhookBodyType
  
  if (body?.data?.authToken !== config.webhook.token) {
    console.log('forbidden')
    throw new ForbiddenError()
  }
  
  try {
    console.log(body)
    const castedBody = validateWixWebhookBody(body)

    await services.email.sendReportEmail({
      to: castedBody.data.email,
      firstname: castedBody.data.firstname,
      didRegisterToNL: castedBody.data.didRegisterToNL === 'TRUE',
    })
  } catch (e) {
    console.error(e)
    throw e
  }

  ctx.status = 200
}