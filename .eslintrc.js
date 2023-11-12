module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'next'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'space-before-function-paren': 'off'
  },
  overrides: [
    {
      // workers
      files: ['*.worker.ts'],
      rules: {
        'indent': ['error', 2],
        'no-restricted-globals': [0],
        'no-isolated-modules': [0]
      }
    }
  ]
}
