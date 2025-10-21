module.exports = {
 root: true,
 parser: '@typescript-eslint/parser',
 parserOptions: {
  project: './tsconfig.json',
  ecmaVersion: 2020,
  sourceType: 'module',
 },
 env: {
  browser: true,
  es2021: true,
  node: true,
 },
 plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier', '@stencil'],
 extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:@stencil/recommended', 'plugin:storybook/recommended'],
 rules: {
  // ** 코드 스타일 **
  'prettier/prettier': ['error'],
  'no-console': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

  // ** import 정렬 **
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',

  // ** Stencil 특화 규칙 **
  // 컴포넌트 클래스명은 PascalCase
  '@stencil/strict-boolean-conditions': 'error',
  '@stencil/strict-prefix': ['error', { prefix: 'sd' }],
  '@stencil/strict-lifecycle': 'error',
  '@stencil/props-must-be-public': 'error',
  '@stencil/decorators-context': 'error',
  '@stencil/own-methods-must-be-private': 'off', // 필요시 on

  // ** 기타 **
  'no-duplicate-imports': 'error',
 },
 ignorePatterns: ['dist', 'www', 'node_modules', '*.config.ts'],
};
