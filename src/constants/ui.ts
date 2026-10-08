/** Visible texts the application shows. Kept in one place so a wording change is a one line fix. */
export const MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  updated: /Successfully Updated/,
  deleted: /Successfully Deleted/,
} as const;

export const MENU = {
  admin: 'Admin',
  pim: 'PIM',
  myInfo: 'My Info',
} as const;

export const NAME_PREFIX = {
  first: 'Auto',
  last: 'User',
} as const;
