import { expect } from '@playwright/test';
import { MenuComponent } from '../components/MenuComponent';
import { ROUTES } from '../constants/endpoints';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly menu = new MenuComponent(this.page);

  // Opens a route and checks the user cannot see its content.

  async expectRouteBlocked(route: string): Promise<void> {
    await this.open(route);

    // Wait until the app has rendered, so the checks below cannot pass on a blank page.
    await expect(this.page.locator('.oxd-topbar-header')).toBeVisible();
    await this.waitForLoader();

    // The admin user list should not be shown
    await expect(this.page.getByRole('heading', { name: 'System Users' })).toHaveCount(0);
    await expect(this.page.getByRole('button', { name: 'Add' })).toHaveCount(0);
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTES.dashboard);
  }
}
