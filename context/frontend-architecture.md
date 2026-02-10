# 前端架构设计文档：产研职能沟通翻译助手 (BridgeAI)

| 文档版本 | 修改日期 | 修改描述 | 作者 |
| :--- | :--- | :--- | :--- |
| V1.0.0 | 2026-02-09 | 初始版本创建 | 前端架构师 |

---

## 1. 技术栈选型

### 1.1 核心技术栈

| 技术 | 版本 | 用途 |
| :--- | :--- | :--- |
| **Node.js** | 18+ | 运行时环境 |
| **React** | 18+ | UI 框架 |
| **TypeScript** | 5+ | 类型安全 |
| **Vite** | 5+ | 构建工具 |
| **WebSocket** | - | 实时流式通信 |

### 1.2 辅助库选型

| 库名称 | 用途 | 理由 |
| :--- | :--- | :--- |
| **zustand** | 状态管理 | 轻量级，API 简洁，适合中小型项目 |
| **react-markdown** | Markdown 渲染 | 支持 GitHub Flavored Markdown |
| **remark-gfm** | Markdown 扩展 | 支持表格、删除线等语法 |
| **framer-motion** | 动画库 | 流畅的打字机效果和过渡动画 |
| **tailwindcss** | CSS 框架 | 快速构建响应式 UI |
| **react-hot-toast** | 通知组件 | 轻量级的提示信息 |
| **reconnecting-websocket** | WebSocket 封装 | 自动重连机制 |

---

## 2. 项目目录结构

```
bridgeai-frontend/
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── assets/               # 静态资源（图片、字体等）
│   │   └── images/
│   ├── components/           # 可复用组件
│   │   ├── common/          # 通用组件
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── TextArea/
│   │   │   └── RoleSelector/
│   │   ├── layout/          # 布局组件
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   └── translation/     # 业务组件
│   │       ├── InputPanel/
│   │       ├── ResultPanel/
│   │       └── StreamingText/
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useWebSocket.ts
│   │   ├── useStreamingText.ts
│   │   ├── useCharacterCount.ts
│   │   └── useClipboard.ts
│   ├── services/            # 服务层
│   │   ├── websocket.ts     # WebSocket 封装
│   │   └── api.ts           # HTTP API（如需）
│   ├── store/               # 状态管理
│   │   ├── translationStore.ts
│   │   └── userStore.ts
│   ├── types/               # TypeScript 类型定义
│   │   ├── translation.ts
│   │   └── websocket.ts
│   ├── utils/               # 工具函数
│   │   ├── constants.ts     # 常量定义
│   │   ├── validation.ts    # 输入验证
│   │   └── formatter.ts     # 格式化工具
│   ├── styles/              # 全局样式
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 入口文件
│   └── vite-env.d.ts
├── .env.development          # 开发环境变量
├── .env.production           # 生产环境变量
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 3. 核心模块设计

### 3.1 状态管理架构 (Zustand)

```typescript
// store/translationStore.ts
interface TranslationState {
  // 用户角色
  role: 'pm' | 'dev' | null;

  // 输入内容
  inputText: string;

  // 翻译结果
  translationResult: string;

  // 流式输出状态
  isStreaming: boolean;

  // WebSocket 连接状态
  wsConnected: boolean;

  // 操作方法
  setRole: (role: 'pm' | 'dev') => void;
  setInputText: (text: string) => void;
  appendStreamingText: (chunk: string) => void;
  clearResult: () => void;
  setStreamingStatus: (status: boolean) => void;
  setWsStatus: (status: boolean) => void;
}
```

### 3.2 WebSocket 通信架构

#### 3.2.1 消息协议设计

```typescript
// types/websocket.ts

// 客户端发送消息格式
interface ClientMessage {
  type: 'translate';
  payload: {
    role: 'pm' | 'dev';
    content: string;
    timestamp: number;
  };
}

// 服务端响应消息格式
interface ServerMessage {
  type: 'chunk' | 'done' | 'error';
  payload: {
    content?: string;      // 流式文本片段
    error?: string;        // 错误信息
    totalTokens?: number;  // 总 token 数（可选）
  };
}
```

#### 3.2.2 WebSocket 封装

```typescript
// services/websocket.ts
import ReconnectingWebSocket from 'reconnecting-websocket';

class WebSocketService {
  private ws: ReconnectingWebSocket | null = null;
  private messageHandlers: Map<string, Function> = new Map();

  connect(url: string) {
    this.ws = new ReconnectingWebSocket(url, [], {
      connectionTimeout: 5000,
      maxRetries: 10,
      maxReconnectionDelay: 3000,
    });

    this.ws.addEventListener('open', this.handleOpen);
    this.ws.addEventListener('message', this.handleMessage);
    this.ws.addEventListener('error', this.handleError);
    this.ws.addEventListener('close', this.handleClose);
  }

  send(message: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  on(event: string, handler: Function) {
    this.messageHandlers.set(event, handler);
  }

  disconnect() {
    this.ws?.close();
  }

  private handleMessage = (event: MessageEvent) => {
    const data: ServerMessage = JSON.parse(event.data);
    const handler = this.messageHandlers.get(data.type);
    if (handler) handler(data.payload);
  };

  // ... 其他方法
}

export const wsService = new WebSocketService();
```

#### 3.2.3 自定义 Hook 封装

```typescript
// hooks/useWebSocket.ts
import { useEffect } from 'react';
import { useTranslationStore } from '@/store/translationStore';
import { wsService } from '@/services/websocket';

export const useWebSocket = () => {
  const {
    setWsStatus,
    appendStreamingText,
    setStreamingStatus
  } = useTranslationStore();

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

    wsService.connect(wsUrl);

    wsService.on('chunk', (payload: { content: string }) => {
      appendStreamingText(payload.content);
    });

    wsService.on('done', () => {
      setStreamingStatus(false);
    });

    wsService.on('error', (payload: { error: string }) => {
      console.error('WebSocket error:', payload.error);
      setStreamingStatus(false);
    });

    return () => {
      wsService.disconnect();
    };
  }, []);

  const sendTranslation = (role: 'pm' | 'dev', content: string) => {
    setStreamingStatus(true);
    wsService.send({
      type: 'translate',
      payload: {
        role,
        content,
        timestamp: Date.now(),
      },
    });
  };

  return { sendTranslation };
};
```

### 3.3 流式文本渲染组件

```typescript
// components/translation/StreamingText/StreamingText.tsx
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  isStreaming
}) => {
  return (
    <div className="streaming-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="markdown-body"
      >
        {content}
      </ReactMarkdown>

      {isStreaming && (
        <motion.span
          className="cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▊
        </motion.span>
      )}
    </div>
  );
};
```

### 3.4 角色选择器组件

```typescript
// components/common/RoleSelector/RoleSelector.tsx
import { useTranslationStore } from '@/store/translationStore';

const ROLES = [
  {
    value: 'pm',
    label: '我是产品经理',
    description: '描述你的需求或想法',
  },
  {
    value: 'dev',
    label: '我是开发工程师',
    description: '描述你的技术方案或改动',
  },
] as const;

export const RoleSelector: React.FC = () => {
  const { role, setRole } = useTranslationStore();

  return (
    <div className="role-selector">
      {ROLES.map((r) => (
        <button
          key={r.value}
          className={`role-button ${role === r.value ? 'active' : ''}`}
          onClick={() => setRole(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};
```

---

## 4. 数据流设计

### 4.1 翻译流程时序图

```
用户                UI组件              Store            WebSocket          后端
 │                   │                   │                  │                │
 │──选择角色─────────>│                   │                  │                │
 │                   │──setRole()───────>│                  │                │
 │                   │                   │                  │                │
 │──输入内容─────────>│                   │                  │                │
 │                   │──setInputText()──>│                  │                │
 │                   │                   │                  │                │
 │──点击翻译─────────>│                   │                  │                │
 │                   │                   │──send()────────>│                │
 │                   │                   │                  │──translate───>│
 │                   │                   │                  │                │
 │                   │                   │                  │<──chunk 1──────│
 │                   │                   │<─append()────────│                │
 │                   │<──rerender────────│                  │                │
 │<──显示文本 1───────│                   │                  │                │
 │                   │                   │                  │<──chunk 2──────│
 │                   │                   │<─append()────────│                │
 │                   │<──rerender────────│                  │                │
 │<──显示文本 2───────│                   │                  │                │
 │                   │                   │                  │      ...       │
 │                   │                   │                  │<──done─────────│
 │                   │                   │<─setStreaming────│                │
 │                   │<──完成状态────────│                  │                │
```

### 4.2 状态同步机制

- **单向数据流**：组件 → Store → WebSocket → 后端
- **响应式更新**：Store 变更 → 组件自动重渲染
- **错误边界**：每层都有错误处理和降级方案

---

## 5. 性能优化策略

### 5.1 渲染优化

| 策略 | 实现方式 |
| :--- | :--- |
| **虚拟化长列表** | 翻译结果超过 1000 字时使用 react-window |
| **防抖输入** | 输入框字数统计使用 300ms 防抖 |
| **懒加载组件** | 使用 React.lazy() 分割代码 |
| **Memo 缓存** | 对 Markdown 渲染组件使用 React.memo |

### 5.2 网络优化

```typescript
// 流式文本分块缓冲优化
class StreamBuffer {
  private buffer: string[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  append(chunk: string) {
    this.buffer.push(chunk);

    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, 50); // 每 50ms 批量更新一次 UI
    }
  }

  private flush() {
    const text = this.buffer.join('');
    // 更新 Store
    useTranslationStore.getState().appendStreamingText(text);
    this.buffer = [];
    this.flushTimer = null;
  }
}
```

### 5.3 移动端优化

- **响应式断点**：Tailwind 配置 sm/md/lg 断点
- **触摸优化**：按钮最小尺寸 44x44px
- **viewport 配置**：禁用双击缩放
- **字体大小**：移动端基础字号 16px（防止自动放大）

---

## 6. 错误处理与降级方案

### 6.1 WebSocket 异常处理

| 异常类型 | 处理策略 |
| :--- | :--- |
| **连接失败** | 自动重连（最多 10 次），显示连接状态提示 |
| **消息发送失败** | 缓存消息，连接恢复后重发 |
| **超时无响应** | 30 秒超时后显示错误提示，允许重试 |
| **服务端错误** | 显示友好错误信息，清空输入框 |

### 6.2 降级方案

```typescript
// 当 WebSocket 不可用时降级为 HTTP 长轮询
const useFallbackPolling = (role: string, content: string) => {
  const [result, setResult] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const poll = async () => {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ role, content }),
      });

      const reader = response.body?.getReader();
      while (!isCancelled && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult(prev => prev + new TextDecoder().decode(value));
      }
    };

    poll();
    return () => { isCancelled = true; };
  }, [role, content]);

  return result;
};
```

---

## 7. 安全性设计

### 7.1 输入验证

```typescript
// utils/validation.ts
export const validateInput = (text: string): {
  valid: boolean;
  error?: string
} => {
  // 长度限制
  if (text.length < 10) {
    return { valid: false, error: '内容至少需要 10 个字符' };
  }
  if (text.length > 5000) {
    return { valid: false, error: '内容不能超过 5000 个字符' };
  }

  // XSS 防护：过滤危险字符
  const dangerousPattern = /<script|javascript:|onerror=/i;
  if (dangerousPattern.test(text)) {
    return { valid: false, error: '检测到非法字符' };
  }

  return { valid: true };
};
```

### 7.2 内容安全策略 (CSP)

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    connect-src 'self' ws://localhost:3000 wss://api.bridgeai.com;
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
  "
>
```

---

## 8. 测试策略

### 8.1 测试层级

| 测试类型 | 工具 | 覆盖范围 |
| :--- | :--- | :--- |
| **单元测试** | Vitest + Testing Library | 工具函数、Hooks、Store |
| **组件测试** | Testing Library | 所有 UI 组件 |
| **E2E 测试** | Playwright | 完整翻译流程 |
| **WebSocket 测试** | Mock Service Worker | 模拟流式响应 |

### 8.2 测试示例

```typescript
// hooks/__tests__/useWebSocket.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';
import WS from 'jest-websocket-mock';

describe('useWebSocket', () => {
  let server: WS;

  beforeEach(() => {
    server = new WS('ws://localhost:3000');
  });

  afterEach(() => {
    WS.clean();
  });

  it('should connect to WebSocket server', async () => {
    const { result } = renderHook(() => useWebSocket());

    await server.connected;
    expect(server).toHaveReceivedConnectionCount(1);
  });

  it('should send translation request', async () => {
    const { result } = renderHook(() => useWebSocket());
    await server.connected;

    result.current.sendTranslation('pm', 'test content');

    await expect(server).toReceiveMessage(
      JSON.stringify({
        type: 'translate',
        payload: expect.objectContaining({
          role: 'pm',
          content: 'test content',
        }),
      })
    );
  });
});
```

---

## 9. 部署方案

### 9.1 环境配置

```bash
# .env.development
VITE_WS_URL=ws://localhost:3000
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_WS_URL=wss://api.bridgeai.com
VITE_API_URL=https://api.bridgeai.com/api
```

### 9.2 构建优化

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // 构建分析
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 9.3 部署流程

```bash
# 1. 构建
npm run build

# 2. 预览
npm run preview

# 3. 部署到静态服务器（如 Nginx/Vercel/Netlify）
# dist/ 目录包含所有静态文件
```

### 9.4 Nginx 配置示例

```nginx
server {
  listen 80;
  server_name bridgeai.com;

  root /var/www/bridgeai/dist;
  index index.html;

  # SPA 路由支持
  location / {
    try_files $uri $uri/ /index.html;
  }

  # WebSocket 代理
  location /ws {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }

  # 静态资源缓存
  location /assets {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 10. 监控与日志

### 10.1 性能监控

```typescript
// utils/performance.ts
export const reportWebVitals = (metric: any) => {
  // 上报到监控平台
  console.log(metric);

  // 可集成 Google Analytics 或 Sentry
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_delta: metric.delta,
    });
  }
};

// main.tsx
import { reportWebVitals } from './utils/performance';
reportWebVitals(console.log);
```

### 10.2 错误追踪

```typescript
// 集成 Sentry
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

// 错误边界
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

---

## 11. 开发规范

### 11.1 代码规范

- **ESLint**: Airbnb 配置 + TypeScript 规则
- **Prettier**: 统一代码格式
- **Husky**: Git Hooks 提交前检查
- **Commitlint**: 规范提交信息（Conventional Commits）

### 11.2 命名规范

| 类型 | 规范 | 示例 |
| :--- | :--- | :--- |
| **组件** | PascalCase | `StreamingText.tsx` |
| **Hooks** | camelCase + use 前缀 | `useWebSocket.ts` |
| **Store** | camelCase + Store 后缀 | `translationStore.ts` |
| **类型** | PascalCase + Interface/Type | `interface ClientMessage` |
| **常量** | UPPER_SNAKE_CASE | `MAX_INPUT_LENGTH` |

### 11.3 Git 工作流

```bash
# 功能分支
feature/role-selector
feature/streaming-text

# 修复分支
fix/websocket-reconnect

# 提交信息格式
feat: 添加角色选择器组件
fix: 修复 WebSocket 重连逻辑
docs: 更新架构文档
```

---

## 12. 里程碑与交付物

| 阶段 | 周期 | 交付物 |
| :--- | :--- | :--- |
| **Phase 1** | Week 1 | 项目脚手架 + 基础组件 + WebSocket 封装 |
| **Phase 2** | Week 2 | 流式渲染 + 状态管理 + 角色切换 |
| **Phase 3** | Week 3 | 样式优化 + 移动端适配 + 错误处理 |
| **Phase 4** | Week 4 | 测试覆盖 + 性能优化 + 部署上线 |

---

## 13. 风险与应对

| 风险 | 影响 | 应对方案 |
| :--- | :--- | :--- |
| **WebSocket 兼容性** | 低 | 提供 HTTP 轮询降级方案 |
| **流式渲染卡顿** | 中 | 使用分块缓冲 + 虚拟化 |
| **移动端键盘遮挡** | 中 | 监听 `resize` 事件调整布局 |
| **大模型响应慢** | 高 | 增加 Loading 骨架屏，优化等待体验 |

---

## 附录 A: 关键依赖版本

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "framer-motion": "^11.0.0",
    "reconnecting-websocket": "^4.4.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.0",
    "playwright": "^1.41.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 附录 B: 参考资料

- [React 18 官方文档](https://react.dev)
- [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
- [Vite 构建优化](https://vitejs.dev/guide/build.html)

---

**文档维护**: 本文档随项目迭代持续更新，所有变更需通过 Code Review 审批。
