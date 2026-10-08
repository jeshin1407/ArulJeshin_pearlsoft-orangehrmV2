import type { APIRequestContext, APIResponse } from '@playwright/test';
import { createLogger } from '../utils/logger';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(`${message} (HTTP ${status}): ${body.slice(0, 300)}`);
    this.name = 'ApiError';
  }
}

type Json = Record<string, unknown>;

/** Thin wrapper around the request context. It logs calls and never asserts. */
export abstract class BaseApi {
  protected readonly log;

  constructor(
    protected readonly request: APIRequestContext,
    scope: string,
  ) {
    this.log = createLogger(scope);
  }

  protected async get(url: string, params?: Record<string, string | number>): Promise<APIResponse> {
    const res = await this.request.get(url, { params });
    this.log.debug(`GET ${url}`, res.status());
    return res;
  }

  protected async post(url: string, data: Json): Promise<APIResponse> {
    const res = await this.request.post(url, { data });
    this.log.debug(`POST ${url}`, res.status());
    return res;
  }

  protected async remove(url: string, data: Json): Promise<APIResponse> {
    const res = await this.request.delete(url, { data });
    this.log.debug(`DELETE ${url}`, res.status());
    return res;
  }

  protected async ensureOk(res: APIResponse, action: string): Promise<void> {
    if (!res.ok()) throw new ApiError(`${action} failed`, res.status(), await res.text());
  }
}
