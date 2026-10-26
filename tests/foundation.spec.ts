import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('registration navigation and validation', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: /create your account/i })
    .first()
    .click();
  await expect(
    page.getByRole('heading', { name: 'Create your account' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByLabel('Full name')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('page search opens and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search navigation' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Find your way' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('mobile navigation opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation is only visible on small screens.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
});

test('registration has no automatically detectable critical or serious accessibility issues', async ({
  page,
}) => {
  await page.goto('/register');
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([]);
});
