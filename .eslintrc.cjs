module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.svelte']
  },
  plugins: ['@typescript-eslint', 'svelte'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    'no-control-regex': 'off',
    'no-constant-condition': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'svelte/no-at-html-tags': 'off'
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.svelte']
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  ignorePatterns: [
    '.svelte-kit/',
    'build/',
    'dist/',
    'coverage/',
    'node_modules/',
    'src/lib/server/database.types.ts'
  ]
};
