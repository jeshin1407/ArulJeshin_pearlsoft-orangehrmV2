import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'node_modules',
      'playwright-report',
      'blob-report',
      'all-blob-reports',
      'test-results',
      'results',
      'sample-reports',
      '.auth',
      'perf',
      'scripts',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions live in page objects and are named expectSomething.
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect.*'] }],
    },
  },
  {
    files: ['src/utils/logger.ts'],
    rules: { 'no-console': 'off' },
  },
);
