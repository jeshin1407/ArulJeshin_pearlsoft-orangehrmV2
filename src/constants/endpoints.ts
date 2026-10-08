const APP = '/web/index.php';

export const API = {
  employees: `${APP}/api/v2/pim/employees`,
  users: `${APP}/api/v2/admin/users`,
  personalDetails: 'personal-details',
} as const;

export const ROUTES = {
  login: `${APP}/auth/login`,
  dashboard: /dashboard/,
  addEmployee: `${APP}/pim/addEmployee`,
  employeeList: `${APP}/pim/viewEmployeeList`,
  personalDetails: (empNumber: number) => `${APP}/pim/viewPersonalDetails/empNumber/${empNumber}`,
  adminUsers: `${APP}/admin/viewSystemUsers`,
} as const;
