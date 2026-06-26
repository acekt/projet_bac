import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 90000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: 'npx next start -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
  },
});
