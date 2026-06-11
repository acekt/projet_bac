import { test, expect } from '@playwright/test';
import { takeAuditScreenshot } from './testUtils';

test.describe('Logique Panier & Drawer', () => {
  test('Ouverture du CartDrawer et conflit multi-magasins', async ({ page, isMobile }) => {
    // 1. Accéder à la page d'accueil puis chercher un magasin
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#magasins')).toBeVisible({ timeout: 10000 });

    // Cliquer sur le premier magasin
    const firstStoreLink = page.locator('#magasins a').first();
    await firstStoreLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Ajouter le premier produit
    const firstProductBtn = page.locator('button[aria-label="Ajouter au panier"]').first();
    // On ignore si la liste des produits est vide
    if (await firstProductBtn.isVisible()) {
        await firstProductBtn.click({ force: true });

        // Ouvrir le panier
        const cartBtn = page.locator('header button').filter({ has: page.locator('svg.lucide-shopping-bag') }).first();
        if (isMobile) {
           const bottomNavCart = page.locator('nav').locator('div').nth(2).locator('button').first();
           await bottomNavCart.click({ force: true });
        } else {
           await cartBtn.click({ force: true });
        }

        // Attendre que le tiroir s'ouvre
        await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible({ timeout: 5000 });
        await takeAuditScreenshot(page, '05-cart-drawer-open', isMobile);

        // Fermer le panier (via le bouton close du sheet ou clic échap)
        await page.keyboard.press('Escape');
    }

    // 2. Aller sur l'accueil, puis cliquer sur un autre magasin (le deuxième)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#magasins')).toBeVisible({ timeout: 10000 });

    const secondStoreLink = page.locator('#magasins a').nth(1);
    if (await secondStoreLink.isVisible()) {
        await secondStoreLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

        // Ajouter un produit du 2e magasin pour déclencher le conflit
        const secondProductBtn = page.locator('button[aria-label="Ajouter au panier"]').first();
        if (await secondProductBtn.isVisible()) {
            await secondProductBtn.click({ force: true });

            // Attendre l'AlertDialog (la modale de conflit)
            await expect(page.locator('[role="alertdialog"]')).toBeVisible({ timeout: 5000 });
            await takeAuditScreenshot(page, '06-cart-multi-store-conflict', isMobile);
        }
    }
  });
});
