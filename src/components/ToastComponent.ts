import { expect, type Locator, type Page } from '@playwright/test';

/** The green or red notification that appears after saving or deleting. */
export class ToastComponent {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('.oxd-toast');
  }

  async expectMessage(text: string | RegExp): Promise<void> {
    await expect(this.root).toContainText(text);
  }
}
