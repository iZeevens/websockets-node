import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [
    eslintPluginPrettier,
    eslintConfigPrettier,
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
})
