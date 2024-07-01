import { PrismaClient } from '@prisma/client'
import cuid2Extension from 'prisma-extension-cuid2'

const prisma = new PrismaClient().$extends(cuid2Extension())

export default prisma
