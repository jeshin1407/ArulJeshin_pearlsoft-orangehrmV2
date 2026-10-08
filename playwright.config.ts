import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/env';
import { ADMIN_AUTH_FILE } from './src/config/paths';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // CI writes a blob per shard. The merge job turns all blobs into one HTML report.
  reporter: isCI
    ? [['blob', { outputDir: 'blob-report' }], ['list']]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'results/junit.xml' }],
        ['json', { outputFile: 'results/results.json' }],
      ],

  use: {
    baseURL: config.baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: ADMIN_AUTH_FILE },
      dependencies: ['setup'],
    },
  ],
});
