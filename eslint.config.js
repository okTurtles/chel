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
      // ts-standard relevant rules:
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': ['error'],
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'indent': ['error', 2],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      // Disable all other noisy rules:
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'no-control-regex': 'off',
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
      '@typescript-eslint/no-unnecessary-condition': 'off', 
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/require-await': 'off',
      // TODO: figure out how to enable this while allowing throw new Deno.errors.*
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      'no-constant-binary-expression': 'off',
      'arrow-body-style': 'off',
      'no-console': 'off',
    }
  }
]
