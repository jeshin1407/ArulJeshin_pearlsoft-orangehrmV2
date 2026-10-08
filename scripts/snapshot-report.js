/* Copies the latest local HTML report into sample-reports/ so it can be committed.
   Run it after a green local run: npm test && npm run report:sample */
const fs = require('node:fs');
const path = require('node:path');

const from = path.resolve('playwright-report');
const to = path.resolve('sample-reports', 'playwright-report');

if (!fs.existsSync(from)) {
  console.error('playwright-report not found. Run the tests first.');
  process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true });
console.log(`Copied report to ${path.relative(process.cwd(), to)}`);
