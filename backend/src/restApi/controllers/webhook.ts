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
    const castedBody = validateWixWebhookBody(body)

    await services.email.sendReportEmail({
      to: castedBody.data.email,
      firstname: castedBody.data.firstname,
      lastname: castedBody.data.lastname,
      didRegisterToNL: castedBody.data.didRegisterToNL === 'Checked',
    })
  } catch (e) {
    console.error(e)
    throw e
  }

  ctx.status = 200
}