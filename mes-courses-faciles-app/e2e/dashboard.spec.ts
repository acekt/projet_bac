import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const screenshotsDir = path.join(process.cwd(), 'qa-audit', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function loginAsAdmin(page) {
  await page.goto('/auth/login');
  await page.locator('input[name="email"]').fill('admin@mcf.com');
  await page.locator('input[name="password"]').fill('Admin12345');
  await page.click('button[type="submit"]:has-text("Se connecter")');
  
  try {
    await expect(page).toHaveURL('/admin', { timeout: 30000 });
  } catch (e) {
    const errorElement = page.locator('.bg-red-50');
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.innerText();
      throw new Error(`Admin login failed with error: ${errorText}`);
    }
    throw e;
  }
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

test.describe('Dashboard and Profile Tabs', () => {
  test.beforeEach(async ({ page }) => {
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

  test('Admin dashboard audit', async ({ page, isMobile }) => {
    // Only run admin dashboard test on desktop, as requested by implementation plan
    if (isMobile) {
      return;
    }

    await loginAsAdmin(page);
    
    // Verify admin page stats are present
    await expect(page.locator('h1:has-text("Vue d\'ensemble")')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Ventes du jour')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Commandes récentes')).toBeVisible({ timeout: 30000 });

    // Take admin dashboard screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'desktop-05-admin-dashboard.png'), fullPage: true });
  });

  test('Client profile and orders tab audit', async ({ page, isMobile }) => {
    await loginAsClient(page);

    // Go to profile page directly
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/profile/, { timeout: 30000 });
    await expect(page.locator('h1:has-text("Jean Dupont")')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=client@mcf.com')).toBeVisible({ timeout: 30000 });

    // Switch to Orders tab
    const ordersTabTrigger = page.locator('button[role="tab"]:has-text("Mes Commandes")');
    await expect(ordersTabTrigger).toBeVisible();
    await ordersTabTrigger.click();

    // Verify loading state finishes and check for orders list
    await expect(page.locator('text=Commande #').first()).toBeVisible({ timeout: 30000 });

    // Take screenshot of the orders timeline
    const prefix = isMobile ? 'mobile' : 'desktop';
    await page.screenshot({ 
      path: path.join(screenshotsDir, `${prefix}-05-profile-orders.png`), 
      fullPage: !isMobile 
    });
  });
});
