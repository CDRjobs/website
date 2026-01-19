import path from 'node:path'
import fs from 'node:fs/promises'
import brevo from '../../lib/brevo'
import config from '../../config'

type SendReportEmailInput = {
  to: string
  firstname: string
  lastname: string
  didRegisterToNL: boolean
}

const sendReportEmail = async ({ to, firstname, lastname, didRegisterToNL }: SendReportEmailInput) => {
  const reportBuffer = await fs.readFile(path.join(config.attachments.path, 'report.pdf'))

  await brevo.sendTransacEmail({
    to: [{ name: `${firstname} ${lastname}`, email: to }],
    templateId: didRegisterToNL ? config.email.reportWithNLTemplateId : config.email.reportNoNLTemplateId,
    params: { firstname },
    tags: ['2025 report'],
    attachment: [{
      name: 'CDRjobs - 2025 CDR Salary Report.pdf',
      content: reportBuffer.toString('base64'),
    }],
  })
}

export default {
  sendReportEmail,
}
