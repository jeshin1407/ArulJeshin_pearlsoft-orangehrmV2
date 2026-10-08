import { test, expect } from '@src/fixtures';
import { buildEmployee } from '@src/utils/dataFactory';

test(
  'creating an employee in the UI is reflected in the API',
  { tag: ['@smoke', '@regression', '@e2e', '@employee'] },
  async ({ addEmployee, employeeApi, cleanup }) => {
    const data = buildEmployee();

    await addEmployee.goto();
    const empNumber = await addEmployee.create(data);
    cleanup.trackEmployee(empNumber);

    const record = await employeeApi.getOrThrow(empNumber);
    expect(record).toMatchObject({
      firstName: data.firstName,
      lastName: data.lastName,
      employeeId: data.employeeId,
    });
  },
);
