import { test, expect } from '@src/fixtures';
import { pollUntil } from '@src/utils/waits';

test(
  'deleting an employee in the UI removes it from the list and the API',
  { tag: ['@regression', '@e2e', '@employee'] },
  async ({ employee, pim, employeeApi }) => {
    await pim.goto();
    await pim.searchById(employee.employeeId);
    await pim.deleteById(employee.employeeId);

    await pim.searchById(employee.employeeId);
    await pim.expectNotListed(employee.employeeId);

    await pollUntil(
      () => employeeApi.exists(employee.empNumber),
      (exists) => !exists,
      {
        message: `employee ${employee.empNumber} should be gone from the API`,
      },
    );
    expect(await employeeApi.find(employee.empNumber)).toBeNull();
  },
);
