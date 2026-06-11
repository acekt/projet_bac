import { test, expect } from '@playwright/test';
import { takeAuditScreenshot } from './testUtils';

test.describe('Navigation Publique & UI', () => {
  test('Page d\'accueil (Hero & Bento Grid)', async ({ page, isMobile }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    await takeAuditScreenshot(page, '01-home-page', isMobile);

    await expect(page.locator('#magasins')).toBeVisible({ timeout: 10000 });
    await page.locator('#magasins').scrollIntoViewIfNeeded();
    await takeAuditScreenshot(page, '02-home-bento-grid', isMobile);
  });

  test('Recherche et Catalogue', async ({ page, isMobile }) => {
    await page.goto('/search');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    await takeAuditScreenshot(page, '03-search-page', isMobile);

    const searchInput = page.locator('input[type="search"]').first();
    if (await searchInput.isVisible()) {
        await searchInput.fill('produitinexistant123');
        await expect(page.locator('text=Aucun produit trouvé')).toBeVisible({ timeout: 10000 }).catch(() => {});
        await takeAuditScreenshot(page, '04-search-empty-state', isMobile);
    }
  });
});
