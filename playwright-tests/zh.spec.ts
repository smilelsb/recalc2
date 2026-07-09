import { type Page, expect, test } from '@playwright/test';

async function waitForLinearCalc(page: Page) {
  await page.waitForTimeout(100);
  await expect(page.getByTestId('linear-main')).toHaveAttribute(
    'data-calculating',
    'false',
    { timeout: 30000 },
  );
}

async function waitForArmCalc(page: Page) {
  await page.waitForTimeout(100);
  await expect(page.getByTestId('arm-main')).toHaveAttribute(
    'data-calculating',
    'false',
    { timeout: 30000 },
  );
}

async function waitForFlywheelCalc(page: Page) {
  await page.waitForTimeout(100);
  await expect(page.getByTestId('flywheel-main')).toHaveAttribute(
    'data-calculating',
    'false',
    { timeout: 30000 },
  );
}

async function waitForRatioFinder(page: Page) {
  await page.waitForTimeout(100);
  await expect(page.getByTestId('ratio-finder-page')).toHaveAttribute(
    'data-calculating',
    'false',
    { timeout: 30000 },
  );
}

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
    await expect(
      page
        .getByTestId('entrypoint')
        .getByRole('link', { name: /直线机构计算器/ }),
    ).toHaveAttribute('href', '/zh/linear');
    await expect(
      page
        .getByTestId('entrypoint')
        .getByRole('link', { name: /机械臂计算器/ }),
    ).toHaveAttribute('href', '/zh/arm');
    await expect(
      page.getByTestId('entrypoint').getByRole('link', { name: /飞轮计算器/ }),
    ).toHaveAttribute('href', '/zh/flywheel');
    await expect(
      page
        .getByTestId('entrypoint')
        .getByRole('link', { name: /传动比查找器/ }),
    ).toHaveAttribute('href', '/zh/ratio-finder');
    await expect(
      page
        .getByTestId('entrypoint')
        .getByRole('link', { name: /传动比计算器/ }),
    ).toHaveAttribute('href', '/zh/ratio');
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

  test('renders the Chinese linear mechanism calculator without changing motor names', async ({
    page,
  }) => {
    await page.goto('/zh/linear');
    await page.waitForLoadState('networkidle');
    await waitForLinearCalc(page);

    await expect(
      page.getByRole('heading', { name: '直线机构计算器' }),
    ).toBeVisible();
    await expect(page.getByText('电机与传动')).toBeVisible();
    await expect(page.getByText('级联')).toBeVisible();
    await expect(page.getByText('负载与行程')).toBeVisible();
    await expect(page.getByText('行程距离')).toBeVisible();
    await expect(page.getByText('线轴直径')).toBeVisible();
    await expect(page.getByRole('heading', { name: '仿真' })).toBeVisible();
    await expect(page.getByText('机构优化')).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await page.getByTestId('selectmotor').click();
    await expect(
      page.getByRole('option', { name: 'NEO', exact: true }),
    ).toBeVisible();
  });

  test('renders the Chinese arm calculator without changing motor names', async ({
    page,
  }) => {
    await page.goto('/zh/arm');
    await page.waitForLoadState('networkidle');
    await waitForArmCalc(page);

    await expect(
      page.getByRole('heading', { name: '机械臂计算器' }),
    ).toBeVisible();
    await expect(page.getByText('电机与传动')).toBeVisible();
    await expect(page.getByText('机械臂几何')).toBeVisible();
    await expect(page.getByText('机械臂长度')).toBeVisible();
    await expect(page.getByText('最小角度')).toBeVisible();
    await expect(page.getByRole('heading', { name: '上行仿真' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '下行仿真' })).toBeVisible();
    await expect(page.getByText('机构优化')).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await page.getByTestId('selectmotor').click();
    await expect(
      page.getByRole('option', { name: 'NEO', exact: true }),
    ).toBeVisible();
  });

  test('renders the Chinese flywheel calculator without changing motor names', async ({
    page,
  }) => {
    await page.goto('/zh/flywheel');
    await page.waitForLoadState('networkidle');
    await waitForFlywheelCalc(page);

    await expect(
      page.getByRole('heading', { name: '飞轮计算器' }),
    ).toBeVisible();
    await expect(page.getByText('电机与电气')).toBeVisible();
    await expect(page.getByRole('heading', { name: '发射轮' })).toBeVisible();
    await expect(page.getByText('发射轮直径')).toBeVisible();
    await expect(page.getByText('目标转速')).toBeVisible();
    await expect(page.getByRole('heading', { name: '射出物' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '仿真' })).toBeVisible();
    await expect(page.getByText('射击分析')).toBeVisible();
    await expect(page.getByText('机构优化')).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await page.getByTestId('selectmotor').click();
    await expect(
      page.getByRole('option', { name: 'NEO', exact: true }),
    ).toBeVisible();
  });

  test('renders the Chinese ratio finder without changing product identifiers', async ({
    page,
  }) => {
    await page.goto('/zh/ratio-finder');
    await page.waitForLoadState('networkidle');
    await waitForRatioFinder(page);

    await expect(
      page.getByRole('heading', { name: '传动比查找器' }),
    ).toBeVisible();
    await expect(page.getByText('目标设置')).toBeVisible();
    await expect(page.getByText('齿数范围')).toBeVisible();
    await expect(page.getByRole('heading', { name: '筛选' })).toBeVisible();
    await expect(page.getByText('每级传动类型')).toBeVisible();
    await expect(page.getByText(/\d+ 个方案/)).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();

    await expect(page.getByRole('checkbox', { name: '20DP' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'GT2' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'REV' })).toBeVisible();
  });

  test('renders the Chinese ratio calculator', async ({ page }) => {
    await page.goto('/zh/ratio');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: '传动比计算器' }),
    ).toBeVisible();
    await expect(page.getByText('级数')).toBeVisible();
    await expect(page.getByText('主动齿数')).toBeVisible();
    await expect(page.getByText('从动齿数')).toBeVisible();
    await expect(
      page.getByTestId('entrypoint').getByText('结果', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('电机转速')).toBeVisible();
    await expect(page.getByRole('button', { name: '添加一级' })).toBeVisible();
    await expect(page.getByRole('button', { name: '复制链接' })).toBeVisible();
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

  test('keeps the English linear calculator unchanged', async ({ page }) => {
    await page.goto('/linear');
    await page.waitForLoadState('networkidle');
    await waitForLinearCalc(page);

    await expect(
      page.getByRole('heading', { name: 'Linear Motion Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Motor & Gearing')).toBeVisible();
    await expect(page.getByText('Travel Distance')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('直线机构计算器')).toHaveCount(0);
  });

  test('keeps the English arm calculator unchanged', async ({ page }) => {
    await page.goto('/arm');
    await page.waitForLoadState('networkidle');
    await waitForArmCalc(page);

    await expect(
      page.getByRole('heading', { name: 'Arm Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Motor & Gearing')).toBeVisible();
    await expect(page.getByText('Arm Geometry')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('机械臂计算器')).toHaveCount(0);
  });

  test('keeps the English flywheel calculator unchanged', async ({ page }) => {
    await page.goto('/flywheel');
    await page.waitForLoadState('networkidle');
    await waitForFlywheelCalc(page);

    await expect(
      page.getByRole('heading', { name: 'Flywheel Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Motors & Electrical')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Shooter Wheel' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('飞轮计算器')).toHaveCount(0);
  });

  test('keeps the English ratio finder unchanged', async ({ page }) => {
    await page.goto('/ratio-finder');
    await page.waitForLoadState('networkidle');
    await waitForRatioFinder(page);

    await expect(
      page.getByRole('heading', { name: 'Ratio Finder' }),
    ).toBeVisible();
    await expect(page.getByText('Target Settings')).toBeVisible();
    await expect(page.getByText('Tooth Ranges')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('传动比查找器')).toHaveCount(0);
  });

  test('keeps the English ratio calculator unchanged', async ({ page }) => {
    await page.goto('/ratio');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Ratio Calculator' }),
    ).toBeVisible();
    await expect(page.getByText('Stages')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Stage' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Link' })).toBeVisible();
    await expect(page.getByText('传动比计算器')).toHaveCount(0);
  });
});
