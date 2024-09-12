import path from 'node:path'
import fs from 'node:fs/promises'
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

const sendReportEmail = async ({ to }: SendReportEmailInput) => {
  const reportBuffer = await fs.readFile(path.join(config.attachments.path, 'report.pdf'))

  await postmarkClient.sendEmailWithTemplate({
    From: config.email.fromAddress,
    To: to,
    TemplateId: config.email.reportTemplateId,
    TemplateModel: {},
    Tag: '2024 report',
    Attachments: [{
      Name: 'CDRjobs - 2024 CDR Salary Report.pdf',
      Content: reportBuffer.toString('base64'),
      ContentType: 'application/pdf',
      ContentID: null
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