import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
}
dotenv.config({ path: '.env' })

const requiredEnvVars = [
  'JWT_KEY',
  'FROM_EMAIL',
  'BREVO_KEY',
  'REPORT_NO_NL_TEMPLATE_ID',
  'REPORT_WITH_NL_TEMPLATE_ID',
  'KOA_KEYS',
  'DATABASE_URL',
  'API_TOKEN',
  'MAPBOX_TOKEN',
  'PUBLIC_PATH',
  'ATTACHMENTS_PATH',
  'IMAGE_FOLDER',
  'WEBHOOK_TOKEN',
]

for (const name of requiredEnvVars) {
  if (!process.env[name]) {
    throw new Error(`Missing environment var "${name}"`)
  }
}

export default {
  db: {
    url: process.env.DATABASE_URL!,
  },
  koa: {
    keys: process.env.KOA_KEYS!.split(','),
  },
  email: {
    fromAddress: process.env.FROM_EMAIL!, 
    brevo: {
      key: process.env.BREVO_KEY!,
    },
    reportNoNLTemplateId: Number(process.env.REPORT_NO_NL_TEMPLATE_ID),
    reportWithNLTemplateId: Number(process.env.REPORT_WITH_NL_TEMPLATE_ID),
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
  attachments: {
    path: process.env.ATTACHMENTS_PATH!
  },
  webhook: {
    token: process.env.WEBHOOK_TOKEN!
  }
}