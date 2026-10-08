import { test as setup } from '@playwright/test';
import { config } from '@src/config/env';
import { ADMIN_AUTH_FILE } from '@src/config/paths';
import { LoginPage } from '@src/pages/LoginPage';

setup.describe.configure({ retries: 2 });

/** Logs in once as admin and saves the session. Every other test reuses it. */
setup('authenticate as admin', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.loginAs(config.admin);
  await login.expectLoggedIn();
  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});
