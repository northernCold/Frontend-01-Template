const { version } = require("webpack")

module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'semi': 'error'
  },
  settings: {
    react: {
      createClass: createReactClass,
      pragma: 'createElement',
      version: 'detect',
      flowVersion: '0.53'
    }
  }
};
