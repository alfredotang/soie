export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type: only allow these specific types (lowercase)
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
      ],
    ],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Scope: must be one of the valid project names when provided
    'scope-enum': [
      2,
      'always',
      [
        // Packages
        '@soie/data-manager',
        '@soie/internal',
      ],
    ],
    // Scope must be lowercase with hyphens when provided
    'scope-case': [2, 'always', 'kebab-case'],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must be in lower case
    'subject-case': [2, 'always', 'lower-case'],
    // Header (first line) max length
    'header-max-length': [2, 'always', 100],
  },
}
