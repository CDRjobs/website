import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'


export default [
  { files: ['**/*.ts']},
  {
    languageOptions: { globals: globals.node },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }]
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]