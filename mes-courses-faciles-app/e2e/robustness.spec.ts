import { test, expect } from '@playwright/test';

test.describe('Robustness and Navigation', () => {
  test('Graceful failure when DB is down', async ({ page }) => {
    await page.goto('/');

    // We expect the error message we implemented earlier
    const dbAlert = page.locator('text=temporairement inaccessibles');
    await expect(dbAlert).toBeVisible();

    const retryBtn = page.locator('button:has-text("Réessayer")');
    await expect(retryBtn).toBeVisible();
  });

  test('Authentication redirect remains functional', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/auth\/login/);

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('Search page interaction without query', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('text=Recherches récentes')).toBeVisible();
    await expect(page.locator('text=Catégories Populaires')).toBeVisible();
  });
});
