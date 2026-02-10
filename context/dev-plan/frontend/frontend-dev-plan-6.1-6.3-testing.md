# 前端开发任务 6.1-6.3: 测试层

## 任务信息
- **Layer**: Layer 5 (质量保障层)
- **并行组**: Group-5 (3个任务可并行)
- **总预估工时**: 90分钟

## 任务列表

### Task 6.1: 单元测试 (TEST-001)
**产出物**:
- `src/hooks/__tests__/useWebSocket.test.ts`
- `src/hooks/__tests__/useCharacterCount.test.ts`
- `src/utils/__tests__/validation.test.ts`
- `src/store/__tests__/translationStore.test.ts`

**示例代码**:
```typescript
// src/hooks/__tests__/useCharacterCount.test.ts
import { renderHook } from '@testing-library/react';
import { useCharacterCount } from '../useCharacterCount';

describe('useCharacterCount', () => {
  test('应该返回正确的字符数', () => {
    const { result } = renderHook(() => useCharacterCount('测试内容'));
    expect(result.current.count).toBe(4);
  });

  test('应该去除首尾空格后计数', () => {
    const { result } = renderHook(() => useCharacterCount('  测试  '));
    expect(result.current.count).toBe(2);
  });
});
```

**覆盖率目标**: > 80%

### Task 6.2: 组件测试 (TEST-002)
**产出物**:
- `src/components/common/__tests__/Button.test.tsx`
- `src/components/common/__tests__/TextArea.test.tsx`
- `src/components/translation/__tests__/StreamingText.test.tsx`

**示例代码**:
```typescript
// src/components/common/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button/Button';

describe('Button Component', () => {
  test('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  test('应该触发点击事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击</Button>);

    fireEvent.click(screen.getByText('点击'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('禁用状态下不应触发点击', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        禁用
      </Button>
    );

    fireEvent.click(screen.getByText('禁用'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('loading 状态应显示加载文本', () => {
    render(<Button loading>提交</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

**测试工具**: @testing-library/react

### Task 6.3: E2E 测试 (TEST-003)
**产出物**: `e2e/translation.spec.ts`

**测试场景**:
1. 完整翻译流程
2. 角色切换
3. 输入验证
4. 复制功能
5. 清空功能

**示例代码**:
```typescript
// e2e/translation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('翻译功能', () => {
  test('完整的翻译流程', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 1. 选择角色
    await page.click('text=我是产品经理');

    // 2. 输入内容
    await page.fill(
      'textarea',
      '我需要一个用户推荐系统，能够根据用户行为推荐相关内容'
    );

    // 3. 点击翻译
    await page.click('text=开始翻译');

    // 4. 等待结果
    await page.waitForSelector('.markdown-body', { timeout: 30000 });

    // 5. 验证结果包含关键词
    const result = await page.textContent('.markdown-body');
    expect(result).toContain('技术实现');

    // 6. 测试复制功能
    await page.click('text=复制结果');
    expect(await page.textContent('button:has-text("已复制")')).toBeTruthy();
  });

  test('输入验证', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 选择角色
    await page.click('text=我是开发工程师');

    // 输入过短内容
    await page.fill('textarea', '短');
    await page.click('text=开始翻译');

    // 应该显示错误提示
    await expect(page.locator('text=内容过短')).toBeVisible();
  });
});
```

**测试工具**: Playwright

## 依赖安装
```bash
# 单元测试
npm install -D vitest @testing-library/react @testing-library/jest-dom

# E2E 测试
npm install -D @playwright/test
npx playwright install
```

## 测试配置

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    port: 5173
  }
});
```

## 验证标准
- [ ] 单元测试覆盖率 > 80%
- [ ] 组件测试全部通过
- [ ] E2E 测试通过完整流程
- [ ] npm test 命令正常运行
- [ ] npm run test:e2e 正常运行

---
**创建时间**: 2026-02-09
