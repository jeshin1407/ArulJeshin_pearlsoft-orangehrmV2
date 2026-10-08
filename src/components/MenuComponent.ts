import { expect, type Locator, type Page } from '@playwright/test';

/** The left side navigation. */
export class MenuComponent {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('.oxd-main-menu');
  }

  private item(name: string): Locator {
    return this.root.getByText(name, { exact: true });
  }

  async expectVisible(...names: string[]): Promise<void> {
    for (const name of names) await expect(this.item(name)).toBeVisible();
  }

  async expectHidden(...names: string[]): Promise<void> {
    for (const name of names) await expect(this.item(name)).toHaveCount(0);
  }
}
