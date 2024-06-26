import { ForgotPasswordTemplateInput } from './templates/getForgotPasswordEmail'
import getForgotPasswordEmail from './templates/getForgotPasswordEmail'
import postmarkClient from '../../lib/postmark'
import config from '../../config'

type SendEmailInput = {
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string
}

const sendEmail = async ({ from, to, subject, html, text }: SendEmailInput) => {
  return postmarkClient.sendEmail({
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    MessageStream: 'outbound'
  })
}

const sendForgotPasswordEmail = async (to: string, templateInput: ForgotPasswordTemplateInput) => {
  const { subject, html, text } = getForgotPasswordEmail(templateInput)

  return sendEmail({ from: config.email.noReplyAddress, to, subject, html, text })
}

export default {
  sendForgotPasswordEmail
}