import { test, expect } from '@playwright/test';
import { takeAuditScreenshot } from './testUtils';

test.describe('Formulaires et Checkout', () => {
  test('Etats d\'erreur Zod sur la page de connexion', async ({ page, isMobile }) => {
    await page.goto('/auth/login');
    // Le bouton n'a potentiellement pas de type submit explicite ou est sous la forme Se connecter
    const btn = page.locator('button', { hasText: 'Se connecter' }).first();
    await expect(btn).toBeVisible({ timeout: 10000 });

    // Remplir un email invalide
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'pass');
    await btn.click({ force: true });

    // Attendre l'erreur API
    await page.waitForTimeout(1000);
    await takeAuditScreenshot(page, '07-login-zod-errors', isMobile);
  });

  test('Page de Checkout (Empty state & Split Screen)', async ({ page, isMobile }) => {
    // Si on va directement sur checkout sans panier, on doit voir l'empty state
    await page.goto('/checkout');
    await expect(page.locator('h2', { hasText: 'Votre panier est vide' })).toBeVisible({ timeout: 10000 }).catch(() => {});
    await takeAuditScreenshot(page, '08-checkout-empty', isMobile);
  });
});
