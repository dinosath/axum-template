import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests configuration for the full stack (backend + frontend).
 * These tests run against docker-compose services.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run sequentially for docker-compose setup
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to manage docker-compose lifecycle
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  timeout: 60000, // 60 seconds per test
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Global setup/teardown for docker-compose */
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
});
