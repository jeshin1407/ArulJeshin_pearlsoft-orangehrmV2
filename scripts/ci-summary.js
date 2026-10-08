/* Reads Playwright's results.json and prints a markdown summary.
   In GitHub Actions it also appends the summary to the job page, so a reviewer sees the totals
   and every flaky test without opening a report. */
const fs = require('node:fs');

const file = process.argv[2] || 'results/results.json';
if (!fs.existsSync(file)) {
  console.error(`No results file at ${file}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const stats = report.stats || {};
const flaky = [];
const failed = [];

function walk(suite, trail) {
  const here = suite.title && !suite.file ? [...trail, suite.title] : trail;
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const name = [...here, spec.title].filter(Boolean).join(' > ');
      const retries = (test.results || []).length - 1;
      if (test.status === 'flaky') flaky.push({ name, retries });
      if (test.status === 'unexpected') failed.push({ name, retries });
    }
  }
  for (const child of suite.suites || []) walk(child, here);
}
(report.suites || []).forEach((suite) => walk(suite, []));

const passed = stats.expected ?? 0;
const lines = [
  '## Test summary',
  '',
  '| Passed | Failed | Flaky | Skipped |',
  '| --- | --- | --- | --- |',
  `| ${passed} | ${stats.unexpected ?? 0} | ${stats.flaky ?? 0} | ${stats.skipped ?? 0} |`,
  '',
];
if (failed.length) {
  lines.push('### Failed', '', ...failed.map((t) => `* ${t.name}`), '');
}
if (flaky.length) {
  lines.push(
    '### Flaky (failed first, passed on retry)',
    '',
    ...flaky.map((t) => `* ${t.name} (${t.retries} ${t.retries === 1 ? 'retry' : 'retries'})`),
    '',
    'Reproduce locally with `npx playwright test --repeat-each=20 --grep "<test name>"`.',
    '',
  );
}

const markdown = lines.join('\n');
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
}
