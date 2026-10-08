import { test, expect } from '@src/fixtures';
import { renamedEmployee } from '@src/utils/dataFactory';

test(
  'updating an employee name in the UI is saved and visible in the API',
  { tag: ['@regression', '@e2e', '@employee'] },
  async ({ employee, details, employeeApi, page }) => {
    const updated = renamedEmployee(employee);

    await details.goto(employee.empNumber);
    await details.updateName(updated.firstName, updated.lastName);

    await page.reload();
    await details.expectName(updated.firstName, updated.lastName);

    const record = await employeeApi.getOrThrow(employee.empNumber);
    expect(record.firstName).toBe(updated.firstName);
    expect(record.lastName).toBe(updated.lastName);
    expect(record.employeeId).toBe(employee.employeeId);
  },
);
