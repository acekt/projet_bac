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
      throw new Error(`Login failed with error: ${errorText}`);
    }
    throw e;
  }
}

test.describe('Checkout and Form Validations', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
      if (msg.type() === 'error' && 
          !msg.text().includes('Failed to load resource') && 
          !msg.text().includes('hydration') && 
          !msg.text().includes('Hydration') &&
          !msg.text().includes('RSC payload') &&
          !msg.text().includes('hot-reloader-client') &&
          !msg.text().includes('webpack-internal') &&
          !msg.text().includes('Failed to sync cart') &&
          !msg.text().includes('Failed to fetch') &&
          !msg.text().includes('TypeError: Load failed')) {
        throw new Error(`Browser console error: ${msg.text()}`);
      }
    });
  });

  test('Form validation and full checkout flow', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile' : 'desktop';

    // 1. Login
    await loginAsClient(page);

    // 2. Add an item from Mbolo store to cart
    const storeCards = page.locator('a[href^="/store/"]');
    await storeCards.first().click();
    await expect(page).toHaveURL(/\/store\//, { timeout: 30000 });

    const addButtons = page.locator('button[aria-label="Ajouter au panier"]');
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // 3. Go to checkout
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);

    // 4. Trigger Zod Validation Errors (only on desktop for desktop-04-checkout-zod-errors.png)
    if (!isMobile) {
      const nameInput = page.locator('input#name');
      const phoneInput = page.locator('input#phone');
      const districtInput = page.locator('input#district');

      // Clear default name and trigger validation
      await nameInput.fill('A'); // less than 2 chars
      await phoneInput.fill('123'); // less than 8 chars
      await districtInput.fill('B'); // less than 2 chars
      
      // Focus something else to trigger validation
      await page.locator('input#indications').focus();

      // Verify validation errors are visible
      await expect(page.locator('text=Le nom est requis')).toBeVisible();
      await expect(page.locator('text=Numéro de téléphone invalide')).toBeVisible();
      await expect(page.locator('text=Le quartier est requis')).toBeVisible();

      // Capture Zod errors screenshot
      await page.screenshot({ path: path.join(screenshotsDir, 'desktop-04-checkout-zod-errors.png'), fullPage: true });
    }

    // 5. Fill with valid details
    await page.locator('input#name').fill('Jean Dupont');
    await page.locator('input#phone').fill('+24106000000');
    await page.locator('input#district').fill('Glass');
    await page.locator('input#indications').fill('Maison bleue');

    // Select a payment method: cash
    const cashLabel = page.locator('label:has-text("À la livraison")');
    await cashLabel.click();

    // Take screenshot of payment step (especially for mobile-04-checkout-payment.png)
    if (isMobile) {
      await page.screenshot({ path: path.join(screenshotsDir, 'mobile-04-checkout-payment.png'), fullPage: true });
    }

    // Submit form (Submit button becomes enabled since form is now valid)
    const submitButton = isMobile 
      ? page.locator('button[type="submit"]').last() // Mobile sticky CTA
      : page.locator('button[type="submit"]').first(); // Desktop sidebar CTA
    
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 6. Verify successful checkout page
    await expect(page.locator('text=Commande validée !')).toBeVisible();
    await expect(page.locator('text=Suivre ma commande')).toBeVisible();

    // Take success screenshot
    await page.screenshot({ path: path.join(screenshotsDir, `${prefix}-04-checkout-success.png`), fullPage: true });
  });
});
