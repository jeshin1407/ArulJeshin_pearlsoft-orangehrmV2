import { defineConfig } from '@playwright/test';

/** Used only by `playwright merge-reports` in CI. It turns the shard blobs into final reports. */
export default defineConfig({
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results/junit.xml' }],
    ['json', { outputFile: 'results/results.json' }],
  ],
});
