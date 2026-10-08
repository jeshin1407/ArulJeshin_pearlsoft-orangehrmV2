import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { EmployeeApi } from '../api/EmployeeApi';
import { UserApi } from '../api/UserApi';
import { config } from '../config/env';
import { ADMIN_AUTH_FILE } from '../config/paths';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import {
  buildEmployee,
  buildUserCredentials,
  type Credentials,
  type EmployeeData,
} from '../utils/dataFactory';

export interface SeededEmployee extends EmployeeData {
  empNumber: number;
}

export interface EssUser extends Credentials {
  empNumber: number;
  userId: number | null;
}

interface Cleanup {
  /** Register an employee created by a test so it is removed after the test, pass or fail. */
  trackEmployee(empNumber: number): void;
}

interface Fixtures {
  // API access, always with the admin session
  adminRequest: APIRequestContext;
  employeeApi: EmployeeApi;
  userApi: UserApi;
  // test data, created through the API and removed in teardown
  cleanup: Cleanup;
  employee: SeededEmployee;
  essUser: EssUser;
  // page objects
  loginPage: LoginPage;
  dashboard: DashboardPage;
  pim: PimPage;
  addEmployee: AddEmployeePage;
  details: EmployeeDetailsPage;
  // a browser already logged in as the ESS user
  essDashboard: DashboardPage;
}

/** Use with test.use() when a test must start logged out. */
export const LOGGED_OUT = { cookies: [], origins: [] };

export const test = base.extend<Fixtures>({
  adminRequest: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: config.baseURL,
      storageState: ADMIN_AUTH_FILE,
    });
    await use(context);
    await context.dispose();
  },
  employeeApi: async ({ adminRequest }, use) => use(new EmployeeApi(adminRequest)),
  userApi: async ({ adminRequest }, use) => use(new UserApi(adminRequest)),

  cleanup: async ({ employeeApi }, use) => {
    const created: number[] = [];
    await use({ trackEmployee: (empNumber) => created.push(empNumber) });
    for (const empNumber of created.reverse()) await employeeApi.deleteQuietly(empNumber);
  },

  employee: async ({ employeeApi, cleanup }, use) => {
    const data = buildEmployee();
    const empNumber = await employeeApi.create(data);
    cleanup.trackEmployee(empNumber);
    await use({ ...data, empNumber });
  },

  essUser: async ({ employeeApi, userApi, cleanup }, use) => {
    const empNumber = await employeeApi.create(buildEmployee());
    cleanup.trackEmployee(empNumber);
    const credentials = buildUserCredentials('ess');
    const userId = await userApi.create({ ...credentials, empNumber, roleId: config.essRoleId });
    await use({ ...credentials, empNumber, userId });
    // The user goes first. The employee is removed afterwards by the cleanup fixture.
    await userApi.deleteQuietly(userId);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboard: async ({ page }, use) => use(new DashboardPage(page)),
  pim: async ({ page }, use) => use(new PimPage(page)),
  addEmployee: async ({ page }, use) => use(new AddEmployeePage(page)),
  details: async ({ page }, use) => use(new EmployeeDetailsPage(page)),

  essDashboard: async ({ loginPage, dashboard, essUser }, use) => {
    await loginPage.goto();
    await loginPage.loginAs(essUser);
    await loginPage.expectLoggedIn();
    await use(dashboard);
  },
});

export { expect };
