import { PrismaClient } from '@prisma/client'
import prisma from '../db/prisma'

export type PrismaTransactionClient = Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>
export type PrismaClientOrTrx = PrismaClient | PrismaTransactionClient
