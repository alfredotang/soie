/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^@nx(/.*|$)', '^node:\\w'],
          ['^\\u0000'],
          ['^@?\\w'],
          ['^'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'prettier/prettier': 'warn',
  },
}
