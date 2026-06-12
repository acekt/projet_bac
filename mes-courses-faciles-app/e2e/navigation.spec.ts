import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper to ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), 'qa-audit', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function loginAsClient(page) {
  await page.goto('/auth/login');
  await page.locator('input[name="email"]').fill('client@mcf.com');
  await page.locator('input[name="password"]').fill('Client12345');
  await page.click('button[type="submit"]:has-text("Se connecter")');
  
  try {
    await expect(page).toHaveURL('/', { timeout: 30000 });
    // Wait for session cookie to settle
    for (let i = 0; i < 20; i++) {
      const cookies = await page.context().cookies();
      const hasCookie = cookies.some(c => c.name === 'mcf_jwt_session');
      if (hasCookie) break;
      await page.waitForTimeout(250);
    }
  } catch (e) {
    const errorElement = page.locator('.bg-red-50');
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.innerText();
      throw new Error(`Client login failed with error: ${errorText}`);
    }
    throw e;
  }
}

test.describe('Navigation and Public Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Fail immediately on browser console errors
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && 
          !text.includes('Failed to load resource') && 
          !text.includes('hydration') && 
          !text.includes('Hydration') &&
          !text.includes('RSC payload') &&
          !text.includes('hot-reloader-client') &&
          !text.includes('webpack-internal') &&
          !text.includes('Failed to sync cart') &&
          !text.includes('Failed to fetch') &&
          !text.includes('TypeError: Load failed')) {
        throw new Error(`Browser console error: ${text}`);
      }
    });
  });

  test('Public browsing flow and screenshots', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile' : 'desktop';

    // Log in first
    await loginAsClient(page);

    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Mes Achats 241/, { timeout: 30000 });
    
    // Wait for the Vos Magasins Partenaires section to be loaded
    const bentoSection = page.locator('h2:has-text("Vos Magasins Partenaires")');
    await expect(bentoSection).toBeVisible({ timeout: 30000 });

    // Verify bento grid stores are loaded
    const storeCards = page.locator('a[href^="/store/"]');
    await expect(storeCards.first()).toBeVisible({ timeout: 30000 });

    // Take Home page screenshot
    await page.screenshot({ path: path.join(screenshotsDir, `${prefix}-01-home-hero.png`), fullPage: true });

    // 2. Go to specific store
    await storeCards.first().click();
    await expect(page).toHaveURL(/\/store\//, { timeout: 30000 });
    await expect(page.locator('text=produits trouvés')).toBeVisible({ timeout: 30000 });

    // Take Store page screenshot
    await page.screenshot({ path: path.join(screenshotsDir, `${prefix}-02-store-page.png`), fullPage: true });

    // 3. Search page and query
    await page.goto('/search');
    await page.waitForTimeout(1500);
    await expect(page.locator('text=Recherches récentes')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Catégories Populaires')).toBeVisible({ timeout: 30000 });

    // Fill search input
    const searchInput = page.locator('input[placeholder="Que cherchez-vous aujourd\'hui ?"]');
    await searchInput.click();
    await searchInput.pressSequentially('Riz', { delay: 100 });
    
    // Press Enter to submit search (or search automatically triggers query)
    await expect(page.locator('text=Résultats pour "Riz"')).toBeVisible({ timeout: 30000 });
    
    // Verify search product exists and click on product title to visit detail page
    const productLink = page.locator('a[href^="/product/"]').first();
    await expect(productLink).toBeVisible({ timeout: 30000 });
    await productLink.click();

    // 4. Verify Product details page
    await expect(page).toHaveURL(/\/product\//, { timeout: 30000 });
    await expect(page.locator('text=Ajouter au panier')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Unité :')).toBeVisible({ timeout: 30000 });

    // Take Product Detail screenshot
    await page.screenshot({ path: path.join(screenshotsDir, `${prefix}-06-product-detail.png`), fullPage: true });
  });
});
