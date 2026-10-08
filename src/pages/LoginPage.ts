import { expect } from '@playwright/test';
import { MESSAGES } from '../constants/ui';
import { ROUTES } from '../constants/endpoints';
import type { Credentials } from '../utils/dataFactory';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.open(ROUTES.login);
    // Don't type until the login form has rendered.
    await expect(this.page.getByPlaceholder('Username')).toBeVisible({ timeout: 30_000 });
  }

  async loginAs({ username, password }: Credentials): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectLoggedIn(): Promise<void> {
    // The demo site can be slow to redirect after login.
    await expect(this.page).toHaveURL(ROUTES.dashboard, { timeout: 30_000 });
  }

  async expectInvalidLogin(): Promise<void> {
    await expect(this.page.getByText(MESSAGES.invalidCredentials)).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(ROUTES.login));
  }
}