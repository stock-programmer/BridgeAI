# 前端开发任务 5.1-5.3: 应用层组装

## 任务信息
- **Layer**: Layer 4 (应用层)
- **执行顺序**: 必须串行执行
- **总预估工时**: 45分钟

## 任务列表

### Task 5.1: ResultPanel 组件 (COMP-BUSINESS-003)
**任务ID**: `APP-PRE`
**文件**: `src/components/translation/ResultPanel/ResultPanel.tsx`
**依赖**: `COMP-BUSINESS-001`, `COMP-COMMON-001`, `HOOK-004`, `STORE-001`

```typescript
import { StreamingText } from '../StreamingText';
import { Button } from '@/components/common/Button';
import { useTranslationStore } from '@/store/translationStore';
import { useClipboard } from '@/hooks/useClipboard';

export const ResultPanel: React.FC = () => {
  const { translationResult, isStreaming, clearResult } =
    useTranslationStore();
  const { copyToClipboard, isCopied } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(translationResult);
  };

  return (
    <div className="result-panel border rounded-lg p-4 min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">翻译结果</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCopy} disabled={!translationResult}>
            {isCopied ? '已复制' : '复制结果'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={clearResult}
            disabled={!translationResult}
          >
            清空
          </Button>
        </div>
      </div>

      {translationResult ? (
        <StreamingText content={translationResult} isStreaming={isStreaming} />
      ) : (
        <div className="text-gray-400 text-center py-20">
          翻译结果将在这里显示...
        </div>
      )}
    </div>
  );
};
```

### Task 5.2: App 根组件 (APP-001)
**任务ID**: `APP-ROOT`
**文件**: `src/App.tsx`
**依赖**: 所有 Layer 3 组件

```typescript
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InputPanel } from '@/components/translation/InputPanel';
import { ResultPanel } from '@/components/translation/ResultPanel';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Toaster } from 'react-hot-toast';

function App() {
  useWebSocket(); // 初始化 WebSocket 连接

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputPanel />
          <ResultPanel />
        </div>
      </main>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
```

### Task 5.3: 入口文件 (APP-002)
**任务ID**: `APP-ENTRY`
**文件**: `src/main.tsx`
**依赖**: `APP-001`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 执行顺序
```
Task 5.1 (ResultPanel) → Task 5.2 (App) → Task 5.3 (main.tsx)
```

## 验证标准
- [ ] 应用可以成功启动
- [ ] 所有组件正确渲染
- [ ] WebSocket 连接成功
- [ ] 翻译功能正常工作
- [ ] 无控制台错误

---
**创建时间**: 2026-02-09
