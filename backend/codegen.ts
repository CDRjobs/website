
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'src/graphql/types/auth.graphql',
    'src/graphql/types/company.graphql',
    'src/graphql/types/job.graphql',
    'src/graphql/types/location.graphql',
    'src/graphql/types/user.graphql',
  ],
  generates: {
    'src/types/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers']
    }
  }
}

export default config
