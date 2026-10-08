import { expect, type Locator, type Page } from '@playwright/test';

/** A result table. Rows are found by the exact text of one of their cells. */
export class TableComponent {
  private readonly page: Page;
  private readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('.oxd-table-body .oxd-table-row');
  }

  rowWithCell(text: string): Locator {
    return this.rows.filter({ has: this.page.getByText(text, { exact: true }) });
  }

  async expectRowCount(text: string, count: number): Promise<void> {
    await expect(this.rowWithCell(text)).toHaveCount(count);
  }

  async clickDeleteIn(row: Locator): Promise<void> {
    await row.locator('button:has(.bi-trash)').click();
  }
}
