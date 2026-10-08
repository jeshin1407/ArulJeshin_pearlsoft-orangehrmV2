import { expect } from '@playwright/test';

interface PollOptions {
  timeout?: number;
  intervals?: number[];
  message?: string;
}

/**
 * Retries an async read until the check passes. Use it for state that settles after a delay,
 * for example a record that disappears from the API shortly after a delete.
 */
export async function pollUntil<T>(
  read: () => Promise<T>,
  check: (value: T) => boolean,
  { timeout = 15_000, intervals = [500, 1_000, 2_000], message }: PollOptions = {},
): Promise<void> {
  await expect.poll(async () => check(await read()), { timeout, intervals, message }).toBe(true);
}
