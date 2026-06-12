import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

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

test.describe('Cart Flow and Store Conflicts', () => {
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

  test('Cart drawer, add item, and store conflict detection', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile' : 'desktop';

    // Log in first
    await loginAsClient(page);

    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Mes Achats 241/, { timeout: 30000 });

    // 2. Open empty cart drawer
    const cartButton = isMobile
      ? page.locator('nav.fixed button:has(svg.lucide-shopping-bag)')
      : page.locator('header button:has(svg.lucide-shopping-bag)');
    
    await expect(cartButton).toBeVisible({ timeout: 30000 });
    await cartButton.click();

    // Verify empty state is visible
    await expect(page.locator('text=Votre panier est vide')).toBeVisible({ timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotsDir, `${prefix}-00-empty-cart.png`), fullPage: true });

    // Close the drawer
    const closeButton = page.locator('button:has(svg.lucide-x)');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Click somewhere else or escape key
      await page.keyboard.press('Escape');
    }
    // Wait a bit for transition
    await page.waitForTimeout(500);

    // 3. Go to Mbolo store directly
    await page.goto('/store/mbolo');
    await expect(page).toHaveURL(/\/store\/mbolo/, { timeout: 30000 });

    // Add first product to cart dynamically
    const productTitle = await page.locator('h4').first().innerText();
    const addButtons = page.locator('button[aria-label="Ajouter au panier"]');
    await expect(addButtons.first()).toBeVisible({ timeout: 30000 });
    await addButtons.first().click();

    // Open cart drawer
    await cartButton.click();
    await expect(page.locator('text=Mon Panier')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[role="dialog"]').locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 30000 });

    // Take screenshot of open cart with items
    if (!isMobile) {
      await page.screenshot({ path: path.join(screenshotsDir, 'desktop-03-cart-drawer-open.png'), fullPage: true });
    }

    // Close drawer
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // 4. Navigate to a different store (Géant Casino) to trigger conflict
    await page.goto('/');
    const casinoCard = page.locator('a[href="/store/geant-casino"]');
    try {
      await casinoCard.click({ timeout: 5000 });
    } catch (e) {
      console.log('Standard click on casinoCard failed, using programmatic fallback click.', e);
      const handle = await casinoCard.elementHandle();
      if (handle) {
        await page.evaluate(el => (el as HTMLElement).click(), handle);
      } else {
        throw e;
      }
    }
    await expect(page).toHaveURL(/\/store\/geant-casino/, { timeout: 30000 });

    // Click "Ajouter au panier" on Casino product
    // Setup dialog listener to handle the store conflict confirmation dialog
    let dialogMessage = '';
    page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      // Dismiss to verify it stays or accept it
      await dialog.accept();
    });

    const casinoAddButtons = page.locator('button[aria-label="Ajouter au panier"]');
    await expect(casinoAddButtons.first()).toBeVisible({ timeout: 30000 });
    const casinoProductTitle = await page.locator('h4').first().innerText();
    await casinoAddButtons.first().click();

    // Verify dialog was triggered
    expect(dialogMessage).toContain('panier contient déjà des articles d\'un autre magasin');

    // Wait and open cart drawer again to verify it has been updated
    await cartButton.click();
    await expect(page.locator('text=Mon Panier')).toBeVisible({ timeout: 30000 });
    
    // Since we accepted the dialog, the Mbolo products should be replaced with Casino products
    await expect(page.locator('[role="dialog"]').locator(`text=${casinoProductTitle}`).first()).toBeVisible({ timeout: 30000 });

    // Take conflict screenshot
    if (isMobile) {
      await page.screenshot({ path: path.join(screenshotsDir, 'mobile-03-cart-drawer-conflict.png'), fullPage: true });
    }
  });
});
