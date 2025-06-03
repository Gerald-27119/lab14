module.exports = {
  env: {
    browser: true,
    node: true, // Added node environment
    es2021: true,
    jest: true, // Added jest globals for tests
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
  },
};
