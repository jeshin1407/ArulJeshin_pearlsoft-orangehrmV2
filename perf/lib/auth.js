import http from 'k6/http';
import { ADMIN_PASS, ADMIN_USER, BASE_URL, PATHS } from './config.js';

const TOKEN_PATTERN = /:token="&quot;([^&]+)&quot;"/;

/**
 * Logs in the way the browser does: read the CSRF token from the login page, then post the form.
 * Returns whether the login worked and the status codes, so scripts can report the reason.
 */
export function login() {
  http.cookieJar().clear(BASE_URL);

  const page = http.get(`${BASE_URL}${PATHS.login}`);
  const match = String(page.body).match(TOKEN_PATTERN);
  if (!match) {
    return { ok: false, status: page.status, reason: 'no csrf token on the login page' };
  }

  const res = http.post(
    `${BASE_URL}${PATHS.validate}`,
    { _token: match[1], username: ADMIN_USER, password: ADMIN_PASS },
    { redirects: 0 },
  );
  return { ok: res.status === 302, status: res.status, reason: 'login post was not a redirect' };
}
