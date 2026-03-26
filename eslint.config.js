const js = require('@eslint/js')
const globals = require('globals')
const tseslint = require('typescript-eslint')
const eslintPluginPrettier = require('eslint-plugin-prettier')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/cdk.out/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  }
)
