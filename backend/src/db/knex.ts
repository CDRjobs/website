import '../types/knex'
import Knex from 'knex'
import { Prisma } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Knex.QueryBuilder.extend('execWithPrisma', function(prisma: PrismaClientOrTrx) {
  const { bindings, sql } = this.toSQL()
  
  if (sql.includes('??')) {
    throw new Error(`Cannot convert identifiers ??. SQL query: ${sql}`)
  }
  return prisma.$queryRaw(Prisma.sql(sql.split('?'), ...bindings))
})

export const knex = Knex({ client: 'postgres' })