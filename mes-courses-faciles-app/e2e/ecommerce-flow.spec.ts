import { test, expect } from '@playwright/test';

test.describe('E-commerce Flow', () => {
  test('full guest flow: browse and add to cart', async ({ page }) => {
    await page.goto('/');

    // Browse stores
    await expect(page.locator('text=Magasins Partenaires')).toBeVisible();

    // Search for a product
    await page.goto('/search');
    await page.fill('input[placeholder="Que cherchez-vous aujourd\'hui ?"]', 'Riz');
    await expect(page.locator('text=Résultats pour "Riz"')).toBeVisible();

    // Add to cart from search results
    const addToCartBtn = page.locator('button').filter({ has: page.locator('svg.lucide-plus') }).first();
    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.click();

      // Check cart badge
      await expect(page.locator('header span:text("1")')).toBeVisible();
    }
  });

  test('checkout requires authentication', async ({ page }) => {
    await page.goto('/cart');
    // If cart is empty, add something first or just try to go to checkout
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
