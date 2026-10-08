import { test, expect, LOGGED_OUT } from '@src/fixtures';
import { API, ROUTES } from '@src/constants/endpoints';
import { MENU } from '@src/constants/ui';

/**
 * An ESS user is a normal employee. Each test gets its own throwaway employee and user from the
 * essUser fixture, signs in as that user, and checks one kind of access.
 */
test.describe('ESS role access', () => {
  test.use({ storageState: LOGGED_OUT });

  test(
    'side menu hides the admin modules',
    { tag: ['@smoke', '@regression', '@rbac'] },
    async ({ essDashboard }) => {
      await essDashboard.menu.expectVisible(MENU.myInfo);
      await essDashboard.menu.expectHidden(MENU.admin, MENU.pim);
    },
  );

  test(
    'direct navigation to the admin user list is blocked',
    { tag: ['@regression', '@rbac'] },
    async ({ essDashboard }) => {
      await essDashboard.expectRouteBlocked(ROUTES.adminUsers);
    },
  );

  test(
    'the admin users API refuses the ESS session',
    { tag: ['@regression', '@rbac', '@api'] },
    async ({ essDashboard, page }) => {
      await essDashboard.expectOnDashboard();

      const response = await page.request.get(API.users);

      expect(response.ok()).toBe(false);
      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(response.status()).toBeLessThan(500);
    },
  );
});
