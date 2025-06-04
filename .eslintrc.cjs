module.exports = {
  extends: [
    'eslint:recommended'
  ],
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  ignorePatterns: ['dist/', 'node_modules/']
};
