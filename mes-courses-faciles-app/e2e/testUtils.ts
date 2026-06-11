import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function takeAuditScreenshot(page: Page, name: string, isMobile: boolean) {
  const dir = path.join(process.cwd(), 'qa-audit', 'screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const prefix = isMobile ? 'mobile-' : 'desktop-';
  const filepath = path.join(dir, `${prefix}${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
}
