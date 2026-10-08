import { test, expect } from '@src/fixtures';
import { buildEmployee, renamedEmployee } from '@src/utils/dataFactory';
import { pollUntil } from '@src/utils/waits';

/**
 * One readable end to end journey: create, update, delete, with the API checked in between.
 * The focused tests next to this file cover each action on its own.
 * Cleanup is handled by the cleanup fixture, so a failure in any step leaves no data behind.
 */
test(
  'employee lifecycle: create, update, verify through the API, delete',
  { tag: ['@smoke', '@regression', '@e2e', '@employee'] },
  async ({ addEmployee, details, pim, employeeApi, cleanup, page }) => {
    const data = buildEmployee();
    const updated = renamedEmployee(data);
    let empNumber = 0;

    await test.step('create the employee in the UI', async () => {
      await addEmployee.goto();
      empNumber = await addEmployee.create(data);
      cleanup.trackEmployee(empNumber);
    });

    await test.step('the API returns the new employee', async () => {
      const record = await employeeApi.getOrThrow(empNumber);
      expect(record.firstName).toBe(data.firstName);
      expect(record.lastName).toBe(data.lastName);
    });

    await test.step('update the name in the UI', async () => {
      await details.updateName(updated.firstName, updated.lastName);
      await page.reload();
      await details.expectName(updated.firstName, updated.lastName);
    });

    await test.step('the API returns the updated name', async () => {
      const record = await employeeApi.getOrThrow(empNumber);
      expect(record.firstName).toBe(updated.firstName);
      expect(record.lastName).toBe(updated.lastName);
    });

    await test.step('delete the employee in the UI', async () => {
      await pim.goto();
      await pim.searchById(data.employeeId);
      await pim.deleteById(data.employeeId);
    });

    await test.step('the employee is gone from the UI and the API', async () => {
      await pim.searchById(data.employeeId);
      await pim.expectNotListed(data.employeeId);
      await pollUntil(
        () => employeeApi.exists(empNumber),
        (exists) => !exists,
      );
    });
  },
);
