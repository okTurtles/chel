// @ts-check
import eslint from "npm:@eslint/js"
import tseslint from "npm:typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'space-before-function-paren': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': ['error'],
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      "@typescript-eslint/no-unused-expressions": "off",
      "no-control-regex": "off",
      'no-restricted-imports': ['error', {
        patterns: [{
          regex: '^jsr:@db/sqlite(?:[@/]|$)',
          message: '@db/sqlite was replaced by better-sqlite3 (#162) and must not be reintroduced, not even in tests.'
        }]
      }],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
)
