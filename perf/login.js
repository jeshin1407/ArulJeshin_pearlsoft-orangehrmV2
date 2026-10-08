import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { USER_AGENT } from './lib/config.js';
import { login } from './lib/auth.js';

export const options = {
  userAgent: USER_AGENT,
  stages: [
    { duration: '20s', target: 5 },
    { duration: '40s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<5000'],
  checks: ['rate>0.99'],
},
};

export default function () {
  const result = login();
  if (!result.ok) {
    console.log(`VU ${__VU} login failed: ${result.reason} (status ${result.status})`);
  }
  check(result, { 'login redirects (302)': (r) => r.ok });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'perf/reports/login.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
  };
}
