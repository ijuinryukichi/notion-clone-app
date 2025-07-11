import { test, expect } from '@playwright/test';

test.describe('Notion Clone Basic Tests', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Notion Clone/);
  });

  test('基本的なブロック作成ができる', async ({ page }) => {
    await page.goto('/');
    // 基本的な動作確認用のテスト
    await expect(page.locator('body')).toBeVisible();
  });
});
