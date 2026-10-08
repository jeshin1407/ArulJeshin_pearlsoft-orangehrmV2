import { expect, type Locator, type Page } from '@playwright/test';
import { ToastComponent } from '../components/ToastComponent';
import { createLogger } from '../utils/logger';

export abstract class BasePage {
  protected readonly log = createLogger(this.constructor.name);
  readonly toast: ToastComponent;

  constructor(protected readonly page: Page) {
    this.toast = new ToastComponent(page);
  }

  async open(route: string): Promise<void> {
    await this.page.goto(route);
  }

  //wait until all spinners go out
  
  protected async waitForLoader(): Promise<void> {
  try {
    await expect(this.page.locator('.oxd-loading-spinner')).toHaveCount(0, { timeout: 15_000 });
  } catch {
    this.log.warn('Loading spinner was still visible after the timeout, continuing');
  }
}


  protected inputByLabel(label: string): Locator {
    return this.page.locator('.oxd-input-group', { hasText: label }).locator('input').first();
  }
}
