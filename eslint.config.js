import parser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import love from 'eslint-config-love'
import eslintComments from 'eslint-plugin-eslint-comments'

export default [
  {
    ...love,
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ...love.languageOptions.parserOptions,
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        sourceType: 'module'
      },
    },
    plugins: {
      ...love.plugins,
      '@typescript-eslint': tseslint,
      'eslint-comments': eslintComments,
    },
    rules: {
      ...love.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'no-control-regex': 'off',
      // Disable all other noisy rules:
      'complexity': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off', 
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      'no-constant-binary-expression': 'off',
      'arrow-body-style': 'off',
      'no-console': 'off',
    }
  }
]
