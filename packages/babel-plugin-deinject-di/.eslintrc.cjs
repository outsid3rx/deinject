const { configure } = require('eslint-kit')

module.exports = {
  ...configure({
    extends: '../../.eslintrc.cjs',
    extend: {
      rules: {
        'import-x/no-default-export': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
      },
    },
  }),
}
