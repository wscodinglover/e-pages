module.exports = {
  extends: [
    "airbnb-base",
    'plugin:vue/essential'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': 'error',
    'space-before-function-paren': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-bitwise': 'off',
    'prefer-rest-params': 'off',
    'no-trailing-spaces': 'off',
    'comma-dangle': 'off',
    'quote-props': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'prefer-spread': 'warn',
    semi: 'warn',
    indent: 'warn',
    'no-tabs': 'warn',
    'no-unused-vars': 'warn',
    quotes: 'warn',
    'no-void': 'off',
    'no-nested-ternary': 'off',
    'import/no-unresolved': 'off',
    'no-return-assign': 'warn',
    'linebreak-style': 'off',
    'prefer-destructuring': 'off',
    'no-restricted-syntax': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}