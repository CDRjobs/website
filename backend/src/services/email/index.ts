import path from 'node:path'
import fs from 'node:fs/promises'
import { ForgotPasswordTemplateInput } from './templates/getForgotPasswordEmail'
import getForgotPasswordEmail from './templates/getForgotPasswordEmail'
import postmarkClient from '../../lib/postmark'
import brevo from '../../lib/brevo'
import config from '../../config'

type SendEmailInput = {
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string
}

type SendMatchingEmailInput = {
  from: string
  to: string
  templateId: number
  templateModel: {
    disciplines: string[]
    contractTypes: string[]
    jobs: {
      title: string
      companyName: string
      location: string
      contractTypes: string
      salary?: string
      remote: string
      datePosted: string
    }[]
  },
}

type SendReportEmailInput = {
  to: string
  firstname: string
  lastname: string
  didRegisterToNL: boolean
}

const sendEmail = async ({ from, to, subject, html, text }: SendEmailInput) => {
  return brevo.sendTransacEmail({
    sender: { email: from },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  })
}

const sendMatchingEmail = async ({ from, to, templateId, templateModel }: SendMatchingEmailInput) => {
  if (process.env.NODE_ENV === 'production') {
    await postmarkClient.sendEmailWithTemplate({
      From: from,
      To: to,
      TemplateId: templateId,
      TemplateModel: templateModel,
      Tag: 'matches'
    })
  } else {
    throw new Error("Can't send matching email when not in production")
  }
}

const sendReportEmail = async ({ to, firstname, lastname, didRegisterToNL }: SendReportEmailInput) => {
  const reportBuffer = await fs.readFile(path.join(config.attachments.path, 'report.pdf'))

  await brevo.sendTransacEmail({
    to: [{ name: `${firstname} ${lastname}`, email: to }],
    templateId: didRegisterToNL ? config.email.reportWithNLTemplateId : config.email.reportNoNLTemplateId,
    params: { firstname },
    tags: ['2024 report'],
    attachment: [{
      name: 'CDRjobs - 2024 CDR Salary Report.pdf',
      content: reportBuffer.toString('base64'),
    }],
  })
}

const sendForgotPasswordEmail = async (to: string, templateInput: ForgotPasswordTemplateInput) => {
  const { subject, html, text } = getForgotPasswordEmail(templateInput)

  return sendEmail({ from: config.email.fromAddress, to, subject, html, text })
}

const getSuppressedEmailsFromPostmark = async () => {
  const { Suppressions: suppressions } = await postmarkClient.getSuppressions('outbound')
  const suppressedEmails = suppressions.map(supp => supp.EmailAddress.toLowerCase())

  return suppressedEmails
}

export default {
  sendMatchingEmail,
  sendReportEmail,
  sendForgotPasswordEmail,
  getSuppressedEmailsFromPostmark,
}