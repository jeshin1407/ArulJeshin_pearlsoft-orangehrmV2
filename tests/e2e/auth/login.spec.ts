import { test, LOGGED_OUT } from '@src/fixtures';
import { config } from '@src/config/env';
import { buildUserCredentials } from '@src/utils/dataFactory';

test.describe('Login', () => {
  test.use({ storageState: LOGGED_OUT });

  test(
    'admin can log in with valid credentials',
    { tag: ['@smoke', '@regression', '@auth'] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginAs(config.admin);
      await loginPage.expectLoggedIn();
    },
  );

  test('wrong password is rejected', { tag: ['@regression', '@auth'] }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs({
      username: config.admin.username,
      password: buildUserCredentials().password,
    });
    await loginPage.expectInvalidLogin();
  });

  test('unknown user is rejected', { tag: ['@regression', '@auth'] }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(buildUserCredentials('nobody'));
    await loginPage.expectInvalidLogin();
  });
});
