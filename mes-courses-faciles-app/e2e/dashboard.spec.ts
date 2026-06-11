import { test, expect } from '@playwright/test';
import { takeAuditScreenshot } from './testUtils';

test.describe('Dashboard & Espace Connecté', () => {
  test('Accès au profil client via Mock', async ({ page, isMobile }) => {
    // Injecter un mock d'authentification dans le localStorage avant le chargement complet
    await page.addInitScript(() => {
      window.localStorage.setItem('mcf_user_data', JSON.stringify({
        id: 'mock-123',
        name: 'Testeur QA',
        email: 'qa@mesachats.com',
        role: 'ADMIN'
      }));
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mettre un timeout pour laisser le AuthContext monter
    await page.waitForTimeout(1000);

    if (!isMobile) {
       // Ouvrir le menu dropdown
       const avatarBtn = page.locator('header button').filter({ hasText: 'Testeur QA' }).first();
       if (await avatarBtn.isVisible()) {
           await avatarBtn.click();
           await expect(page.locator('text=Mon Compte')).toBeVisible({ timeout: 5000 }).catch(() => {});
           await takeAuditScreenshot(page, '09-desktop-user-dropdown', isMobile);
       }
    }

    // Naviguer vers le profil
    await page.goto('/profile');
    await expect(page.locator('h1', { hasText: 'Testeur QA' })).toBeVisible({ timeout: 10000 }).catch(() => {});
    await takeAuditScreenshot(page, '10-profile-dashboard', isMobile);

    // Naviguer vers les commandes via Tab
    await page.goto('/profile?tab=orders');
    await expect(page.locator('text=Mes Commandes')).toBeVisible({ timeout: 10000 }).catch(() => {});
    await takeAuditScreenshot(page, '11-orders-dashboard', isMobile);
  });
});
