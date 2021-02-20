module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 120 }],
    'no-console': 'off',
  },
};
