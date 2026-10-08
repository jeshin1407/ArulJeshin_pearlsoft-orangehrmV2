import { API, ROUTES } from '../constants/endpoints';
import { MESSAGES } from '../constants/ui';
import { TableComponent } from '../components/TableComponent';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  readonly table = new TableComponent(this.page);

  async goto(): Promise<void> {
    await this.open(ROUTES.employeeList);
  }

  async searchById(employeeId: string): Promise<void> {
    await this.inputByLabel('Employee Id').fill(employeeId);
    const listLoaded = this.page.waitForResponse(
      (r) => r.url().includes(API.employees) && r.request().method() === 'GET',
    );
    await this.page.getByRole('button', { name: 'Search' }).click();
    await listLoaded;
    await this.waitForLoader();
  }

  /**
   * The search matches part of an id and the demo site is shared, so the row is picked by its
   * exact Employee Id. This also stops the test from deleting someone else's record.
   */
  async deleteById(employeeId: string): Promise<void> {
    await this.table.expectRowCount(employeeId, 1);
    await this.table.clickDeleteIn(this.table.rowWithCell(employeeId));
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await this.toast.expectMessage(MESSAGES.deleted);
  }

  async expectNotListed(employeeId: string): Promise<void> {
    await this.table.expectRowCount(employeeId, 0);
  }
}
