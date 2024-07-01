import 'knex'
import { PrismaClientOrTrx } from '../types'

declare module 'knex' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Knex {
    interface QueryBuilder {
      execWithPrisma(prisma: PrismaClientOrTrx): unknown
    }
  }
}
