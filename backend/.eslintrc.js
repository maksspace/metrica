module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'max-lines-per-function': ['error', 100],
    'max-lines': ['error', 400],
    'no-console': 'error',
    camelcase: 'error',
    complexity: ['error', 20],
    'no-inline-comments': 'error',
    curly: ['error'],
  },
};
