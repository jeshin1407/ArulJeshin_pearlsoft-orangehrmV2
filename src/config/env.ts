import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Environment loader.
 *
 * ENV selects the file (.env.demo, .env.staging, ...). A real environment variable always wins
 * over the file, but an empty one is ignored. That matters in CI, where a missing secret arrives
 * as an empty string and would otherwise hide the value from the file.
 * There are no credential defaults in code. A missing value stops the run with a clear message.
 */
const envName = process.env.ENV?.trim() || 'demo';
const envFile = path.resolve(process.cwd(), `.env.${envName}`);
const fileValues: Record<string, string> = fs.existsSync(envFile)
  ? dotenv.parse(fs.readFileSync(envFile))
  : {};

function read(key: string): string | undefined {
  const value = process.env[key]?.trim() || fileValues[key]?.trim();
  return value || undefined;
}

function required(key: string): string {
  const value = read(key);
  if (!value) {
    throw new Error(
      `Missing ${key} for environment "${envName}". ` +
        `Set it as an environment variable or add it to ${path.basename(envFile)} ` +
        `(see .env.example).`,
    );
  }
  return value;
}

export const config = {
  envName,
  baseURL: required('BASE_URL'),
  admin: {
    username: required('ADMIN_USER'),
    password: required('ADMIN_PASS'),
  },
  essRoleId: Number(read('ESS_ROLE_ID') ?? 2),
} as const;
