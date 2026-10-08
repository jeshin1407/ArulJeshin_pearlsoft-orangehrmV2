import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { BASE_URL, PATHS, USER_AGENT } from './lib/config.js';
import { login } from './lib/auth.js';

export const options = {
  userAgent: USER_AGENT,
  stages: [
    { duration: '15s', target: 2 },
    { duration: '30s', target: 2 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<5000'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  // The demo site rejects a second API call on a session, so each iteration signs in first.
  const session = login();
  if (!session.ok) {
    console.log(`VU ${__VU} login failed: ${session.reason} (status ${session.status})`);
    sleep(2);
    return;
  }

  const employeeId = `${String(Date.now()).slice(-6)}${__VU}${__ITER % 100}`;
  const payload = JSON.stringify({
    firstName: `Perf${__VU}`,
    middleName: '',
    lastName: `User${__ITER}`,
    empPicture: null,
    employeeId,
  });

  const res = http.post(`${BASE_URL}${PATHS.employees}`, payload, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  if (res.status !== 200 && __ITER < 3) {
    console.log(`VU ${__VU} create status ${res.status} body ${String(res.body).slice(0, 150)}`);
  }
  check(res, { 'employee created (200)': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'perf/reports/employee-create.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
  };
}
