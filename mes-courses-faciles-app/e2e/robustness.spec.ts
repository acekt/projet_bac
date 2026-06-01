import { test, expect } from '@playwright/test';

test.describe('Robustness and Navigation', () => {
  test('Graceful failure or Store Display based on DB state', async ({ page }) => {
    await page.goto('/');

    const dbAlert = page.locator('text=temporairement inaccessibles');
    const storeHeader = page.locator('text=Magasins Partenaires');

    // Make the test resilient by accepting either normal display or DB alert
    const isDbAlertVisible = await dbAlert.isVisible();
    const isStoreHeaderVisible = await storeHeader.isVisible();

    expect(isDbAlertVisible || isStoreHeaderVisible).toBe(true);
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
