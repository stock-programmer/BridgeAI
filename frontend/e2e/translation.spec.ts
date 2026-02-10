import { test, expect } from '@playwright/test';

test.describe('翻译功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应用加载成功', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('text=雷石翻译')).toBeVisible();

    // 验证主要组件存在
    await expect(page.locator('text=输入内容')).toBeVisible();
    await expect(page.locator('text=翻译结果')).toBeVisible();
  });

  test('角色切换功能', async ({ page }) => {
    // 默认选中 PM
    const pmButton = page.locator('button:has-text("我是产品经理")');
    const devButton = page.locator('button:has-text("我是开发工程师")');

    // PM 按钮应该有 primary 样式
    await expect(pmButton).toHaveClass(/bg-primary/);

    // 切换到 Dev
    await devButton.click();
    await expect(devButton).toHaveClass(/bg-primary/);
    await expect(pmButton).not.toHaveClass(/bg-primary/);

    // 切回 PM
    await pmButton.click();
    await expect(pmButton).toHaveClass(/bg-primary/);
    await expect(devButton).not.toHaveClass(/bg-primary/);
  });

  test('输入验证 - 空内容', async ({ page }) => {
    // 尝试提交空内容
    const submitButton = page.locator('button:has-text("提交翻译")');

    // 提交按钮应该被禁用
    await expect(submitButton).toBeDisabled();
  });

  test('输入验证 - 有效内容', async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("提交翻译")');

    // 输入有效内容
    await textarea.fill('这是一段测试内容，用于验证输入功能是否正常工作');

    // 提交按钮应该可用
    await expect(submitButton).not.toBeDisabled();
  });

  test('字符计数功能', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 初始状态
    await expect(page.locator('text=0 / 5000')).toBeVisible();

    // 输入内容
    await textarea.fill('测试内容');

    // 字符计数应该更新
    await expect(page.locator('text=4 / 5000')).toBeVisible();
  });

  test('清空结果功能', async ({ page }) => {
    // 模拟有翻译结果的情况（通过直接设置）
    // 注意：这个测试需要实际的 WebSocket 连接或模拟数据

    const clearButton = page.locator('button:has-text("清空")');

    // 清空按钮初始应该被禁用（因为没有结果）
    await expect(clearButton).toBeDisabled();
  });

  test('复制功能按钮状态', async ({ page }) => {
    const copyButton = page.locator('button:has-text("复制结果")');

    // 复制按钮初始应该被禁用（因为没有结果）
    await expect(copyButton).toBeDisabled();
  });

  test('WebSocket 连接状态显示', async ({ page }) => {
    // 验证连接状态指示器存在
    const statusIndicator = page.locator('header').locator('text=/已连接|未连接/');
    await expect(statusIndicator).toBeVisible();
  });

  test('响应式布局 - 桌面视图', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 验证两列布局
    const inputPanel = page.locator('.input-panel');
    const resultPanel = page.locator('.result-panel');

    await expect(inputPanel).toBeVisible();
    await expect(resultPanel).toBeVisible();
  });

  test('响应式布局 - 移动视图', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 验证单列布局（仍然可见，但是垂直排列）
    const inputPanel = page.locator('.input-panel');
    const resultPanel = page.locator('.result-panel');

    await expect(inputPanel).toBeVisible();
    await expect(resultPanel).toBeVisible();
  });

  test('输入框自动调整高度', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 获取初始高度
    const initialHeight = await textarea.evaluate((el) => el.clientHeight);

    // 输入多行内容
    await textarea.fill('第一行\n第二行\n第三行\n第四行\n第五行');

    // 等待一下让高度调整
    await page.waitForTimeout(100);

    // 获取新高度
    const newHeight = await textarea.evaluate((el) => el.clientHeight);

    // 新高度应该大于初始高度
    expect(newHeight).toBeGreaterThan(initialHeight);
  });

  test('最大字符长度限制', async ({ page }) => {
    const textarea = page.locator('textarea');

    // 尝试输入超过最大长度的内容
    const longText = 'a'.repeat(5001);
    await textarea.fill(longText);

    // 验证实际值被限制在 5000 个字符
    const value = await textarea.inputValue();
    expect(value.length).toBeLessThanOrEqual(5000);
  });

  test('占位符文本根据角色变化', async ({ page }) => {
    const textarea = page.locator('textarea');
    const pmButton = page.locator('button:has-text("我是产品经理")');
    const devButton = page.locator('button:has-text("我是开发工程师")');

    // PM 角色的占位符
    await pmButton.click();
    let placeholder = await textarea.getAttribute('placeholder');
    expect(placeholder).toContain('产品需求');

    // Dev 角色的占位符
    await devButton.click();
    placeholder = await textarea.getAttribute('placeholder');
    expect(placeholder).toContain('开发内容');
  });
});

test.describe('UI 组件样式', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Header 显示正确', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 验证 Logo 和标题
    await expect(page.locator('text=雷石翻译')).toBeVisible();
    await expect(page.locator('text=PM-Dev 实时协作翻译系统')).toBeVisible();
  });

  test('Footer 显示正确', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 验证版权信息
    await expect(page.locator('text=/© \\d{4} 雷石翻译系统/')).toBeVisible();

    // 验证链接
    await expect(page.locator('text=关于我们')).toBeVisible();
    await expect(page.locator('text=使用帮助')).toBeVisible();
    await expect(page.locator('text=隐私政策')).toBeVisible();
    await expect(page.locator('text=联系我们')).toBeVisible();
  });

  test('按钮样式正确', async ({ page }) => {
    const submitButton = page.locator('button:has-text("提交翻译")');
    await expect(submitButton).toBeVisible();

    // 验证按钮有正确的样式类
    await expect(submitButton).toHaveClass(/rounded-md/);
    await expect(submitButton).toHaveClass(/bg-primary/);
  });
});
