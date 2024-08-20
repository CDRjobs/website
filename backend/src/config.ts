import 'dotenv/config'

const requiredEnvVars = [
  'RESET_PASSWORD_URL',
  'JWT_KEY',
  'FROM_EMAIL',
  'POSTMARK_KEY',
  'FIRST_EMAIL_TEMPLATE_ID',
  'SECOND_EMAIL_TEMPLATE_ID',
  'FIRST_EMAIL_NO_MATCH_TEMPLATE_ID',
  'SECOND_EMAIL_NO_MATCH_TEMPLATE_ID',
  'KOA_KEYS',
  'DATABASE_URL',
  'API_TOKEN',
  'MAPBOX_TOKEN',
  'PUBLIC_PATH',
  'IMAGE_FOLDER',
  'ALLOW_SENDING_MATCHING_EMAILS',
]

for (const name of requiredEnvVars) {
  if (!process.env[name]) {
    throw new Error(`Missing environment var "${name}"`)
  }
}

export default {
  forgotPassword: {
    resetUrl: process.env.RESET_PASSWORD_URL!,
  },
  db: {
    url: process.env.DATABASE_URL!,
  },
  koa: {
    keys: process.env.KOA_KEYS!.split(','),
  },
  email: {
    allowSendingMatchingEmail: process.env.ALLOW_SENDING_MATCHING_EMAILS === 'true',
    fromAddress: process.env.FROM_EMAIL!, 
    postmark: {
      key: process.env.POSTMARK_KEY!,
    },
    firstEmailTemplateId: process.env.FIRST_EMAIL_TEMPLATE_ID,
    secondEmailTemplateId: process.env.SECOND_EMAIL_TEMPLATE_ID,
    firstEmailNoMatchTemplateId: process.env.FIRST_EMAIL_NO_MATCH_TEMPLATE_ID,
    secondEmailNoMatchTemplateId: process.env.SECOND_EMAIL_NO_MATCH_TEMPLATE_ID,
  },
  jwt: {
    key: process.env.JWT_KEY!
  },
  api: {
    token: process.env.API_TOKEN!
  },
  mapbox: {
    token: process.env.MAPBOX_TOKEN!
  },
  public: {
    path: process.env.PUBLIC_PATH!,
    imageFolder: process.env.IMAGE_FOLDER!,
  },
}