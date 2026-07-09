import { expect, test } from '@playwright/test';

test.describe('Simplified Chinese pages', () => {
  test('keeps the English home page unchanged', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'ReCalc' })).toBeVisible();
    await expect(page.getByText('Belt Calculator').first()).toBeVisible();
    await expect(page.getByText('同步带计算器')).toHaveCount(0);
  });

  test('renders a Chinese home page under /zh', async ({ page }) => {
    await page.goto('/zh');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByText('面向 FRC 和 FTC 的机械设计计算器'),
    ).toBeVisible();
    await expect(
      page
        .getByTestId('entrypoint')
        .getByRole('link', { name: /同步带计算器/ }),
    ).toHaveAttribute('href', '/zh/belts');
    await expect(
      page.getByTestId('entrypoint').getByRole('link', { name: /链条计算器/ }),
    ).toHaveAttribute('href', '/zh/chains');
    await expect(page.getByText('计算器').first()).toBeVisible();
  });

  test('renders the Chinese belt calculator without changing part names', async ({
    page,
  }) => {
    await page.goto('/zh/belts');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: '同步带计算器' }),
    ).toBeVisible();
    const entrypoint = page.getByTestId('entrypoint');
    await expect(entrypoint.getByText('参数')).toBeVisible();
    await expect(page.getByText('使用自定义同步带')).toBeVisible();
    await expect(page.getByText('目标中心距')).toBeVisible();
    await expect(page.getByTestId('selectdesiredCenter')).toContainText('mm');
    await expect(page.getByTestId('beltToothIncrement')).toHaveValue('1');
    await expect(page.getByText('同步带轮 1')).toBeVisible();
    await expect(page.getByText('较小同步带')).toBeVisible();
    await expect(page.getByText('匹配的 COTS 同步带轮')).toBeVisible();
    await expect(
      page.getByText('匹配的 COTS 同步带', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'GT2 (3mm)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'HTD (5mm)' })).toBeVisible();
  });

  test('renders the Chinese chain calculator without changing chain names', async ({
    page,
  }) => {
    await page.goto('/zh/chains');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: '链条计算器' }),
    ).toBeVisible();
    await expect(page.getByText('链条类型')).toBeVisible();
    await expect(page.getByText('允许半链节')).toBeVisible();
    await expect(page.getByText('目标中心距')).toBeVisible();
    await expect(page.getByTestId('selectdesiredCenter')).toContainText('mm');
    await expect(page.getByText('链轮 1')).toBeVisible();
    await expect(page.getByText('较小链条')).toBeVisible();
    await expect(page.getByText('匹配的 COTS 链轮')).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await expect(page.getByRole('combobox').first()).toContainText('#25');
    await page.getByTestId('chainType').click();
    await expect(page.getByRole('option', { name: '#35' })).toBeVisible();
  });

  test('keeps the English belt calculator unchanged', async ({ page }) => {
    await page.goto('/belts');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Belt Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Parameters')).toBeVisible();
    await expect(page.getByText('Matching COTS Belts')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('同步带计算器')).toHaveCount(0);
  });

  test('keeps the English chain calculator unchanged', async ({ page }) => {
    await page.goto('/chains');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Chain Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Chain Type')).toBeVisible();
    await expect(page.getByText('Matching COTS Sprockets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('链条计算器')).toHaveCount(0);
  });
});
