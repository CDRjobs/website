import 'dotenv/config'

const requiredEnvVars = [
  'RESET_PASSWORD_URL',
  'JWT_KEY',
  'NO_REPLY_EMAIL',
  'POSTMARK_KEY',
  'KOA_KEYS',
  'DATABASE_URL',
  'API_TOKEN',
  'MAPBOX_TOKEN',
  'PUBLIC_PATH',
  'IMAGE_FOLDER',
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
    noReplyAddress: process.env.NO_REPLY_EMAIL!, 
    postmark: {
      key: process.env.POSTMARK_KEY!,
    }
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