import { randomBytes, randomInt } from 'node:crypto';
import { NAME_PREFIX } from '../constants/ui';

export interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export interface Credentials {
  username: string;
  password: string;
}

let sequence = 0;

/** Unique per call, per worker and per run, so parallel workers and retries never collide. */
function uniqueSuffix(): string {
  const worker = process.env.TEST_PARALLEL_INDEX ?? '0';
  sequence += 1;
  return `${Date.now().toString(36)}${worker}${sequence.toString(36)}`;
}

/** Employee Id allows 10 characters. Six time digits plus four random digits. */
function uniqueEmployeeId(): string {
  return `${String(Date.now()).slice(-6)}${randomInt(1000, 10000)}`;
}

export function buildEmployee(overrides: Partial<EmployeeData> = {}): EmployeeData {
  const suffix = uniqueSuffix();
  return {
    firstName: `${NAME_PREFIX.first}${suffix}`,
    middleName: '',
    lastName: `${NAME_PREFIX.last}${suffix}`,
    employeeId: uniqueEmployeeId(),
    ...overrides,
  };
}

export function renamedEmployee(
  employee: EmployeeData,
): Pick<EmployeeData, 'firstName' | 'lastName'> {
  return {
    firstName: `${employee.firstName}Edit`,
    lastName: `${employee.lastName}Edit`,
  };
}

/** Random credentials for a throwaway user. Nothing secret is stored in the repo. */
export function buildUserCredentials(prefix = 'ess'): Credentials {
  return {
    username: `${prefix}_${randomBytes(4).toString('hex')}`,
    password: `Aa1!${randomBytes(8).toString('hex')}`,
  };
}
