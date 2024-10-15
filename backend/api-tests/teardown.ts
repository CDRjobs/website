import { rimraf } from 'rimraf'

export default async () => {
  global.__SERVER__.stop()
  await rimraf(process.env.PUBLIC_PATH!)
}