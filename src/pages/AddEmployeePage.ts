import { ROUTES } from '../constants/endpoints';
import type { EmployeeData } from '../utils/dataFactory';
import { BasePage } from './BasePage';

export class AddEmployeePage extends BasePage {
  async goto(): Promise<void> {
    await this.open(ROUTES.addEmployee);
  }

  /** Fills the form, saves, and returns the new employee number taken from the URL. */
  async create(employee: EmployeeData): Promise<number> {
    await this.page.getByPlaceholder('First Name').fill(employee.firstName);
    if (employee.middleName) {
      await this.page.getByPlaceholder('Middle Name').fill(employee.middleName);
    }
    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);
    await this.inputByLabel('Employee Id').fill(employee.employeeId);
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForURL(/viewPersonalDetails\/empNumber\/\d+/);

    const match = this.page.url().match(/empNumber\/(\d+)/);
    if (!match) throw new Error(`Could not read the employee number from ${this.page.url()}`);
    return Number(match[1]);
  }
}
