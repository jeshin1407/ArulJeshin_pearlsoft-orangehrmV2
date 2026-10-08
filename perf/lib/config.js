function requireEnv(name) {
  const value = __ENV[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Start the test with "npm run perf:login" or "npm run perf:employee", ` +
        `or pass it with: k6 run -e ${name}=value <script>`,
    );
  }
  return value;
}

export const BASE_URL = requireEnv('BASE_URL');
export const ADMIN_USER = requireEnv('ADMIN_USER');
export const ADMIN_PASS = requireEnv('ADMIN_PASS');

export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';

export const PATHS = {
  login: '/web/index.php/auth/login',
  validate: '/web/index.php/auth/validate',
  employees: '/web/index.php/api/v2/pim/employees',
};
