# 前端开发任务 1.8: 全局样式配置

## 任务信息
- **任务ID**: `STYLE-001`
- **依赖**: 无
- **并行组**: Group-0
- **预估工时**: 15分钟

## 产出物
- `src/styles/globals.css`
- `src/styles/variables.css`

## 完整代码

### src/styles/globals.css
```css
@import 'variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Markdown 样式 */
.markdown-body {
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body p {
  margin-bottom: 1em;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

.markdown-body code {
  background-color: var(--bg-code);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-body pre {
  background-color: var(--bg-code);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-body pre code {
  background: none;
  padding: 0;
}

/* 打字机光标 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: var(--primary-color);
  margin-left: 2px;
  vertical-align: text-bottom;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
```

### src/styles/variables.css
```css
:root {
  /* 颜色 */
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-code: #f3f4f6;
  --bg-hover: #f3f4f6;

  /* 文字颜色 */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-disabled: #9ca3af;

  /* 边框颜色 */
  --border-color: #e5e7eb;
  --border-focus: #3b82f6;

  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* 过渡 */
  --transition-fast: 150ms;
  --transition-base: 300ms;
  --transition-slow: 500ms;
}

/* 暗色模式 (可选) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-code: #374151;
    --bg-hover: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-disabled: #9ca3af;
    --border-color: #374151;
  }
}
```

## 在 main.tsx 中引入
```typescript
import './styles/globals.css';
```

## 验证
- [ ] 全局样式生效
- [ ] CSS 变量可用
- [ ] Tailwind 样式正常

---
**创建时间**: 2026-02-09
