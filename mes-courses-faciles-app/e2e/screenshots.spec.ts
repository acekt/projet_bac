import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Output directories setup
const uiGalleryDir = path.join(process.cwd(), 'test-results', 'ui-gallery');
const publicDir = path.join(uiGalleryDir, 'public');
const clientDir = path.join(uiGalleryDir, 'client');
const adminDir = path.join(uiGalleryDir, 'admin');
const exceptionsDir = path.join(uiGalleryDir, 'exceptions');

test.beforeAll(async () => {
  for (const dir of [publicDir, clientDir, adminDir, exceptionsDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
});

test.afterAll(async () => {
  await prisma.$disconnect();
});

// Helper to clear a user's cart in the database
async function clearUserCart(email: string) {
  try {
    const clientUser = await prisma.user.findUnique({
      where: { email }
    });
    if (clientUser) {
      await prisma.cartItem.deleteMany({
        where: { userId: clientUser.id }
      });
      console.log(`✓ Cart cleared in database for ${email}`);
    }
  } catch (err) {
    console.error(`Warning: Failed to clear cart items for ${email}:`, err);
  }
}

// Helper for Client Login (using robust API authentication to bypass WebKit Secure cookie limits on localhost HTTP)
async function loginAsClient(page) {
  console.log("[DEBUG loginAsClient] Logging in client via API...");
  const response = await page.request.post('/api/auth/login', {
    data: {
      email: 'client@mcf.com',
      password: 'Client12345'
    }
  });
  if (!response.ok()) {
    throw new Error(`API Login failed: ${response.status()} ${response.statusText()}`);
  }

  // Wait for the cookie to settle in the browser context and strip secure flag
  let sessionCookie;
  for (let i = 0; i < 20; i++) {
    const cookies = await page.context().cookies();
    sessionCookie = cookies.find(c => c.name === 'mcf_jwt_session');
    if (sessionCookie) break;
    await page.waitForTimeout(100);
  }

  if (sessionCookie) {
    await page.context().addCookies([{
      ...sessionCookie,
      secure: false
    }]);
    console.log("[DEBUG loginAsClient] Cookie mcf_jwt_session verified and secure flag set to false");
  } else {
    console.log("[DEBUG loginAsClient] Warning: mcf_jwt_session cookie not found");
  }

  console.log("[DEBUG loginAsClient] API login successful, loading home page...");
  await page.goto('/');
  await expect(page.locator('header').first()).toBeVisible({ timeout: 15000 });

  // Sync client user data to localStorage
  const clientUser = await prisma.user.findUnique({
    where: { email: 'client@mcf.com' }
  });
  if (clientUser) {
    await page.evaluate((user) => {
      localStorage.setItem('mcf_user_data', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name || 'Client',
        role: user.role
      }));
      localStorage.removeItem('mcf_cart');
    }, clientUser);
    console.log("[DEBUG loginAsClient] Synced client user data to localStorage");
  }
}

// Helper for Admin Login (using robust API authentication to bypass WebKit Secure cookie limits on localhost HTTP)
async function loginAsAdmin(page) {
  console.log("[DEBUG loginAsAdmin] Logging in admin via API...");
  const response = await page.request.post('/api/auth/login', {
    data: {
      email: 'admin@mcf.com',
      password: 'Admin12345'
    }
  });
  if (!response.ok()) {
    throw new Error(`API Login failed: ${response.status()} ${response.statusText()}`);
  }

  // Wait for the cookie to settle in the browser context and strip secure flag
  let sessionCookie;
  for (let i = 0; i < 20; i++) {
    const cookies = await page.context().cookies();
    sessionCookie = cookies.find(c => c.name === 'mcf_jwt_session');
    if (sessionCookie) break;
    await page.waitForTimeout(100);
  }

  if (sessionCookie) {
    await page.context().addCookies([{
      ...sessionCookie,
      secure: false
    }]);
    console.log("[DEBUG loginAsAdmin] Cookie mcf_jwt_session verified and secure flag set to false");
  } else {
    console.log("[DEBUG loginAsAdmin] Warning: mcf_jwt_session cookie not found");
  }

  console.log("[DEBUG loginAsAdmin] API login successful, loading admin dashboard...");
  await page.goto('/admin');
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });

  // Sync admin user data to localStorage
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@mcf.com' }
  });
  if (adminUser) {
    await page.evaluate((user) => {
      localStorage.setItem('mcf_user_data', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name || 'Admin',
        role: user.role
      }));
      localStorage.removeItem('mcf_cart');
    }, adminUser);
    console.log("[DEBUG loginAsAdmin] Synced admin user data to localStorage");
  }
}

test.describe('Visual Gallery - Mes Courses Faciles', () => {
  
  test.beforeEach(async ({ page }) => {
    // Gracefully handle browser console errors (ignore typical dev/webpack/hydration noise)
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
        console.log(`[BROWSER CONSOLE ERROR] ${text}`);
      }
    });
  });

  // ==========================================
  // 1. Parcours Public (Visiteur non authentifié)
  // ==========================================
  
  test('1.1 Public Flow - Home Page', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    await page.goto('/');
    await expect(page.locator('h2:has-text("Partenaires")').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('a[href^="/store/"]').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000); // Wait for animations
    await page.screenshot({ path: path.join(publicDir, `${prefix}home.png`), fullPage: true });
  });

  test('1.2 Public Flow - Search Page', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    await page.goto('/search');
    const searchInput = page.locator('input[placeholder="Que cherchez-vous aujourd\'hui ?"]');
    await expect(searchInput).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Nominal Search
    await searchInput.click();
    await searchInput.pressSequentially('Riz', { delay: 100 });
    await expect(page.locator('text=Résultats pour "Riz"').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}search-results.png`), fullPage: true });

    // Empty Search
    await searchInput.click();
    await searchInput.fill('');
    await searchInput.pressSequentially('ZzzNonExistentProduct', { delay: 50 });
    await expect(page.locator('text=Aucun résultat').first()).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}search-empty.png`), fullPage: true });
  });

  test('1.3 Public Flow - Store and Product Details and 404', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    
    // Store Page
    await page.goto('/');
    await expect(page.locator('a[href^="/store/"]').first()).toBeVisible({ timeout: 60000 });
    const storeUrl = await page.locator('a[href^="/store/"]').first().getAttribute('href');
    if (!storeUrl) throw new Error("Could not find a store URL on home page");
    
    await page.goto(storeUrl);
    await expect(page.locator('text=produits trouvés').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(publicDir, `${prefix}store.png`), fullPage: true });

    // Product Page
    const productUrl = await page.locator('a[href^="/product/"]').first().getAttribute('href');
    if (!productUrl) throw new Error("Could not find a product URL on store page");
    
    await page.goto(productUrl);
    await expect(page.locator('text=Ajouter au panier').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(publicDir, `${prefix}product.png`), fullPage: true });

    // 404 Exception Page
    await page.goto('/some-non-existent-page');
    await expect(page.locator('text=Oups ! Page introuvable').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(exceptionsDir, `${prefix}not-found.png`), fullPage: true });
  });

  // ==========================================
  // 2. Parcours Authentification
  // ==========================================
  
  test('2.1 Auth Flow - Login and Register Modals', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';

    // Login Modal
    await page.goto('/?auth=login');
    await expect(page.locator('button[type="submit"]:has-text("Se connecter")')).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}login-modal.png`), fullPage: true });

    // Register Modal
    await page.goto('/?auth=register');
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}register-modal.png`), fullPage: true });
  });

  test('2.2 Auth Flow - Validation Errors', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';

    await page.goto('/?auth=login');
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 30000 });
    
    await page.locator('input[name="email"]').fill('nonexistent@mcf.com');
    await page.locator('input[name="password"]').fill('wrongpassword123');
    await page.click('button[type="submit"]:has-text("Se connecter")');
    
    await expect(page.locator('.text-red-500').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(exceptionsDir, `${prefix}login-validation-errors.png`), fullPage: true });
  });

  test('2.3 Auth Flow - Standalone Pages', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';

    // Standalone Login page
    await page.goto('/auth/login');
    await expect(page.locator('button[type="submit"]:has-text("Se connecter")')).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}login-page.png`), fullPage: true });

    // Standalone Register page
    await page.goto('/auth/register');
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(publicDir, `${prefix}register-page.png`), fullPage: true });
  });

  // ==========================================
  // 3. Parcours Client (Connecté via client@mcf.com)
  // ==========================================
  
  test('3.1 Client Flow - Profile Dashboard', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    await loginAsClient(page);

    console.log("[DEBUG 3.1] Navigating to /profile...");
    await page.goto('/profile');
    console.log("[DEBUG 3.1] Navigated to /profile. Current URL:", page.url());
    await expect(page.locator('text=client@mcf.com').first()).toBeVisible({ timeout: 60000 });
    
    const ordersTabTrigger = page.locator('button[role="tab"]:has-text("Mes Commandes")');
    await expect(ordersTabTrigger).toBeVisible({ timeout: 15000 });
    await ordersTabTrigger.click();
    await expect(page.locator('text=Commande #').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(clientDir, `${prefix}profile-dashboard.png`), fullPage: true });
  });

  test('3.2 Client Flow - Shopping Cart Drawers', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    
    // Empty client cart in database before starting to ensure clean state
    await clearUserCart('client@mcf.com');
    await loginAsClient(page);

    // Empty Drawer view
    await page.goto('/');
    await expect(page.locator('h2:has-text("Partenaires")').first()).toBeVisible({ timeout: 60000 });
    
    const cartButton = isMobile
      ? page.locator('nav.fixed button:has(svg.lucide-shopping-bag)')
      : page.locator('header button:has(svg.lucide-shopping-bag)');
    
    await expect(cartButton).toBeVisible({ timeout: 30000 });
    await cartButton.click();
    await expect(page.locator('text=Votre panier est vide').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}cart-empty-drawer.png`), fullPage: true });

    // Close Drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Add item to cart
    const storeUrl = await page.locator('a[href^="/store/"]').first().getAttribute('href');
    if (!storeUrl) throw new Error("Could not find store URL on homepage");
    await page.goto(storeUrl);
    await page.waitForSelector('button[title="Se déconnecter"]', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('[data-cart-loaded="true"]', { state: 'attached', timeout: 15000 });
    
    const addButtons = page.locator('button[aria-label="Ajouter au panier"]');
    await expect(addButtons.first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000); // Allow CartContext sync lock to release
    const productTitle = await page.locator('h4').first().innerText();
    await addButtons.first().click();

    // Filled Drawer view (open if not already open)
    const drawer = page.locator('[role="dialog"]');
    if (!(await drawer.isVisible())) {
      await cartButton.click();
    }
    await expect(page.locator('text=Mon Panier').first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[role="dialog"]').locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}cart-filled-drawer.png`), fullPage: true });
  });

  test('3.3 Client Flow - Checkout Steps', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    
    console.log("[DEBUG 3.3] Starting test...");
    // Reset cart to add exactly 1 product
    await clearUserCart('client@mcf.com');
    console.log("[DEBUG 3.3] Cart cleared");
    await loginAsClient(page);
    console.log("[DEBUG 3.3] Logged in as client");

    // Go to first store and add item to cart
    await expect(page.locator('a[href^="/store/"]').first()).toBeVisible({ timeout: 60000 });
    const storeUrl = await page.locator('a[href^="/store/"]').first().getAttribute('href');
    console.log("[DEBUG 3.3] Store URL is:", storeUrl);
    if (!storeUrl) throw new Error("Could not find store URL");
    await page.goto(storeUrl);
    console.log("[DEBUG 3.3] Navigated to store page");
    await page.waitForSelector('button[title="Se déconnecter"]', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('[data-cart-loaded="true"]', { state: 'attached', timeout: 15000 });
    
    const addButtons = page.locator('.p-5 button[aria-label="Ajouter au panier"]');
    await expect(addButtons.first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000); // Allow CartContext sync lock to release
    await addButtons.first().click();
    console.log("[DEBUG 3.3] Clicked add to cart button");
    await page.waitForTimeout(2000); // Wait for cart database sync server action to complete

    // Go to Checkout
    await page.goto('/checkout');
    console.log("[DEBUG 3.3] Navigated to /checkout");
    await expect(page.locator('text=Livraison').first()).toBeVisible({ timeout: 60000 });
    console.log("[DEBUG 3.3] Delivery section visible");
    await page.waitForTimeout(1000);

    // Log the HTML content of the form
    const formHtml = await page.locator('form').first().innerHTML().catch((e) => `Error getting HTML: ${e.message}`);
    console.log("[DEBUG 3.3] Form HTML content:\n", formHtml);

    // Checkout Validation errors (Step 1)
    const nameInput = page.locator('input#name');
    const phoneInput = page.locator('input#phone');
    const districtInput = page.locator('input#district');

    console.log("[DEBUG 3.3] Filling invalid details...");
    await nameInput.focus();
    await nameInput.fill('A');
    await nameInput.blur();

    await phoneInput.focus();
    await phoneInput.fill('123');
    await phoneInput.blur();

    await districtInput.focus();
    await districtInput.fill('B');
    await districtInput.blur();
    console.log("[DEBUG 3.3] Invalid details filled and blurred");
    
    console.log("[DEBUG 3.3] Verifying error messages...");
    await expect(page.locator('text=Le nom complet doit contenir').first()).toBeVisible({ timeout: 30000 });
    console.log("[DEBUG 3.3] Name error visible");
    await expect(page.locator('text=Format de téléphone Gabon').first()).toBeVisible({ timeout: 30000 });
    console.log("[DEBUG 3.3] Phone error visible");
    await expect(page.locator('text=Le quartier de Libreville est requis').first()).toBeVisible({ timeout: 30000 });
    console.log("[DEBUG 3.3] District error visible");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(exceptionsDir, `${prefix}checkout-validation-errors.png`), fullPage: true });

    // Fill valid details for Step 1
    console.log("[DEBUG 3.3] Filling valid details...");
    await nameInput.fill('Jean Dupont');
    await phoneInput.fill('+24166000000'); // Valid Gabon phone format
    await districtInput.fill('Glass');
    await page.locator('input#indications').fill('Maison bleue, à côté de la pharmacie');
    console.log("[DEBUG 3.3] Valid details filled");

    const continueToPaymentBtn = page.locator('button:has-text("Continuer vers le paiement")');
    await expect(continueToPaymentBtn).toBeEnabled({ timeout: 15000 });
    await continueToPaymentBtn.click();
    console.log("[DEBUG 3.3] Clicked Continuer vers le paiement");

    // Wait for Step 2: PaymentMethodStep
    await expect(page.locator('text=Moyen de paiement').first()).toBeVisible({ timeout: 15000 });
    console.log("[DEBUG 3.3] Step 2 PaymentMethodStep visible");
    
    // Choose cash payment method
    const cashLabel = page.locator('label:has-text("Paiement à la livraison")');
    await expect(cashLabel).toBeVisible({ timeout: 15000 });
    await cashLabel.click();
    console.log("[DEBUG 3.3] Cash payment clicked");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}checkout-payment.png`), fullPage: true });

    // Submit order on Step 2
    const confirmAndPayBtn = page.locator('button[type="submit"]:has-text("Confirmer et payer")');
    await expect(confirmAndPayBtn).toBeEnabled({ timeout: 15000 });
    await confirmAndPayBtn.click();
    console.log("[DEBUG 3.3] Clicked Confirmer et payer");

    // Success Screen
    await expect(page.locator('text=Commande validée !').first()).toBeVisible({ timeout: 60000 });
    console.log("[DEBUG 3.3] Success screen visible");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(clientDir, `${prefix}checkout-success.png`), fullPage: true });
  });

  test('3.4 Client Flow - Standalone Cart and Favorites Pages', async ({ page, isMobile }) => {
    const prefix = isMobile ? 'mobile-' : 'desktop-';
    
    // Reset client cart in database before starting to ensure clean state
    await clearUserCart('client@mcf.com');
    await loginAsClient(page);

    // Empty Favorites page
    await page.evaluate(() => {
      localStorage.removeItem('mcf_favorites');
    });
    await page.goto('/favorites');
    await expect(page.locator('text=Aucun favori pour le moment').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}favorites-empty.png`), fullPage: true });

    // Empty Cart Page
    await page.goto('/cart');
    await expect(page.locator('text=Votre panier est vide').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}cart-page-empty.png`), fullPage: true });

    // Go to first store and add item to cart and favorites
    await page.goto('/');
    await expect(page.locator('a[href^="/store/"]').first()).toBeVisible({ timeout: 60000 });
    const storeUrl = await page.locator('a[href^="/store/"]').first().getAttribute('href');
    if (!storeUrl) throw new Error("Could not find store URL");
    await page.goto(storeUrl);
    await page.waitForSelector('button[title="Se déconnecter"]', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('[data-cart-loaded="true"]', { state: 'attached', timeout: 15000 });

    // Add to favorites (click heart button on first product card)
    const favoriteButton = page.locator('button[aria-label="Ajouter aux favoris"]').first();
    await expect(favoriteButton).toBeVisible({ timeout: 30000 });
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Add to cart
    const addButtons = page.locator('.p-5 button[aria-label="Ajouter au panier"]');
    await expect(addButtons.first()).toBeVisible({ timeout: 30000 });
    const productTitle = await page.locator('h4').first().innerText();
    await addButtons.first().click();
    await page.waitForTimeout(2000); // Wait for cart database sync

    // Favorites Filled Page
    await page.goto('/favorites');
    await expect(page.locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}favorites-filled.png`), fullPage: true });

    // Cart Filled Page
    await page.goto('/cart');
    await expect(page.locator(`text=${productTitle}`).first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(clientDir, `${prefix}cart-page-filled.png`), fullPage: true });
  });

  // ==========================================
  // 4. Parcours Admin (Connecté via admin@mcf.com)
  // ==========================================
  
  test('4.1 Admin Flow - Dashboard and Lists', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip(true, 'Skipping Admin Flow on Mobile');
      return;
    }

    const prefix = 'desktop-';
    await loginAsAdmin(page);

    // Dashboard overview
    await expect(page.locator('h1:has-text("Vue d\'ensemble")').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('text=Ventes du jour').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('text=Commandes récentes').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}dashboard.png`), fullPage: true });

    // Orders list
    await page.goto('/admin/orders');
    await expect(page.locator('h1:has-text("Gestion des Commandes")').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('text=Client').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}orders-list.png`), fullPage: true });

    // Products list
    await page.goto('/admin/products');
    await expect(page.locator('text=Produit').first()).toBeVisible({ timeout: 60000 });
    await expect(page.locator('text=Stock').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}products-list.png`), fullPage: true });
  });

  test('4.2 Admin Flow - Sheet Creation Forms and Validation', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip(true, 'Skipping Admin Flow on Mobile');
      return;
    }

    const prefix = 'desktop-';
    await loginAsAdmin(page);

    // Product Create Sheet
    await page.goto('/admin/products?new=product');
    await expect(page.locator('text=Nouveau Produit').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}product-create-sheet.png`), fullPage: true });

    // Submit Empty (Validation error)
    await page.click('button[type="submit"]:has-text("Créer le Produit")');
    await expect(page.locator('text=Le nom du produit doit contenir').first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=Le prix doit être un nombre positif').first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(exceptionsDir, `${prefix}product-create-validation-errors.png`), fullPage: true });

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Store Create Sheet
    await page.goto('/admin/stores?new=store');
    await expect(page.locator('text=Nouveau Magasin').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}store-create-sheet.png`), fullPage: true });
  });

  test('4.3 Admin Flow - Additional Pages', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip(true, 'Skipping Admin Flow on Mobile');
      return;
    }

    const prefix = 'desktop-';
    await loginAsAdmin(page);

    // 1. Analytics
    await page.goto('/admin/analytics');
    await expect(page.locator('h1:has-text("Analytiques")').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}analytics.png`), fullPage: true });

    // 2. Notifications
    await page.goto('/admin/notifications');
    await expect(page.locator('h1:has-text("Centre de Notifications")').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}notifications.png`), fullPage: true });

    // 3. Settings
    await page.goto('/admin/settings');
    await expect(page.locator('h1:has-text("Configuration")').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}settings.png`), fullPage: true });

    // 4. Stores List
    await page.goto('/admin/stores');
    await expect(page.locator('h1:has-text("Gestion des Magasins")').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}stores-list.png`), fullPage: true });

    // 5. Users List
    await page.goto('/admin/users');
    await expect(page.locator('h1:has-text("Gestion des Clients")').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}users-list.png`), fullPage: true });

    // 6. Client Create Sheet
    await page.goto('/admin/users?new=client');
    await expect(page.locator('text=Nouveau Client').first()).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(adminDir, `${prefix}client-create-sheet.png`), fullPage: true });
  });

});
