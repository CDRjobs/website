import { PrismaClient } from '@prisma/client'
import cuid2Extension from 'prisma-extension-cuid2'

const prisma = new PrismaClient()

const extendedPrisma = prisma.$extends(cuid2Extension())

export default extendedPrisma
