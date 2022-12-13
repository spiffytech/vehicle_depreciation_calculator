// ESLint doesn't support executing as an ES Module yet.
// https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'prettier',
  ],
  ignorePatterns: ['.eslintrc.cjs'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Stop complaining about async setInterval callbacks. The rule
        // enforces that things that need a non-Promise get one.
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        // Present an error if we forget to await a Promise. Sort of. In some
        // cases. This rule misses some really obvious cases.
        '@typescript-eslint/no-floating-promises': [
          'error',
          {
            ignoreVoid: true,
          },
        ],
      },
    },
  ],
  rules: {
    // TypeScript already enforces this
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
