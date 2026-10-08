//Runs a k6 script with the same environment values the Playwright tests use.

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const dotenv = require('dotenv');

const script = process.argv[2];
if (!script) {
  console.error('Usage: node scripts/run-k6.js <k6 script>');
  process.exit(1);
}

const envName = (process.env.ENV || 'demo').trim();
const envFile = path.resolve(`.env.${envName}`);
const fileValues = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile)) : {};

const args = ['run'];
for (const key of ['BASE_URL', 'ADMIN_USER', 'ADMIN_PASS']) {
  const value = (process.env[key] || '').trim() || (fileValues[key] || '').trim();
  if (!value) {
    console.error(`Missing ${key}. Set it as an environment variable or in .env.${envName}`);
    process.exit(1);
  }
  args.push('-e', `${key}=${value}`);
}
args.push(script);

const result = spawnSync('k6', args, { stdio: 'inherit' });
if (result.error) {
  console.error('Could not start k6. Is it installed and on your PATH? Run: k6 version');
  process.exit(1);
}
process.exit(result.status ?? 1);
