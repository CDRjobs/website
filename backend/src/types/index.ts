import { PrismaClient } from '@prisma/client'

export type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>
export type PrismaClientOrTrx = PrismaClient | PrismaTransactionClient