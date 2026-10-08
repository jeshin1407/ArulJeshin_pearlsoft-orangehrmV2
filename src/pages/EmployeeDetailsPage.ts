import { expect } from '@playwright/test';
import { API, ROUTES } from '../constants/endpoints';
import { MESSAGES } from '../constants/ui';
import { BasePage } from './BasePage';

export class EmployeeDetailsPage extends BasePage {
  async goto(empNumber: number): Promise<void> {
    await this.open(ROUTES.personalDetails(empNumber));
  }

  async updateName(firstName: string, lastName: string): Promise<void> {
    await this.waitForLoader();

    const first = this.page.getByPlaceholder('First Name');
    const last = this.page.getByPlaceholder('Last Name');

    // The form fills itself after the page appears. Typing earlier gets overwritten.
    await expect(first).not.toHaveValue('');
    await expect(last).not.toHaveValue('');

    await first.fill(firstName);
    await last.fill(lastName);
    await expect(first).toHaveValue(firstName);
    await expect(last).toHaveValue(lastName);

    const saved = this.page.waitForResponse(
      (r) => r.url().includes(API.personalDetails) && r.request().method() === 'PUT',
    );
    await this.page.getByRole('button', { name: 'Save' }).first().click();
    await saved;
    await this.toast.expectMessage(MESSAGES.updated);
  }

  async expectName(firstName: string, lastName: string): Promise<void> {
    await expect(this.page.getByPlaceholder('First Name')).toHaveValue(firstName);
    await expect(this.page.getByPlaceholder('Last Name')).toHaveValue(lastName);
  }
}
