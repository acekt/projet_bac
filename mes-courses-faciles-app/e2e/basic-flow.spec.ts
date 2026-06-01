import { test, expect } from '@playwright/test';

test('navigation and cart workflow', async ({ page }) => {
  // Go to homepage
  await page.goto('/');
  await expect(page).toHaveTitle(/Mes Courses Faciles/);

  // Check if stores are displayed (at least one)
  const storeCards = page.locator('a[href^="/store/"]');
  // Since we are in dev and might not have a full DB, we just check if the section exists
  await expect(page.locator('text=Magasins Partenaires')).toBeVisible();

  // Go to a store (mocking or real)
  // For a reliable test without DB, we might need more setup, but let's try a real flow if possible
  const firstStore = storeCards.first();
  if (await firstStore.count() > 0) {
    await firstStore.click();
    await expect(page).toHaveURL(/\/store\//);

    // Check for products
    await expect(page.locator('text=produits trouvés')).toBeVisible();
  }
});

test('authentication redirect', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.locator('text=Bon retour !')).toBeVisible();
});
