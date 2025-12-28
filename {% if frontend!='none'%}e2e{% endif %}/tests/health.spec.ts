import { test, expect } from '@playwright/test';

test.describe('Application Health', () => {
  test('frontend loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Page should load without errors
    await expect(page).toHaveTitle(/.*/);
  });

  test('backend health endpoint responds', async ({ request }) => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await request.get(`${backendUrl}/health`);
    
    expect(response.ok()).toBeTruthy();
  });
});
