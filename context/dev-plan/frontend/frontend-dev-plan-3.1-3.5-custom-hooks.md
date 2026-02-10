# 前端开发任务 3.1-3.5: 自定义Hooks层

## 任务信息
- **Layer**: Layer 2 (抽象层)
- **并行组**: Group-2 (5个任务可并行)
- **总预估工时**: 60分钟

## 任务列表

### Task 3.1: useWebSocket Hook (HOOK-001)
**文件**: `src/hooks/useWebSocket.ts`
**依赖**: `SERVICE-001`, `STORE-001`

```typescript
import { useEffect } from 'react';
import { useTranslationStore } from '@/store/translationStore';
import { wsService } from '@/services/websocket';

export const useWebSocket = () => {
  const { setWsStatus, appendStreamingText, setStreamingStatus } =
    useTranslationStore();

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

    wsService.connect(wsUrl);

    wsService.on('chunk', (payload: { content: string }) => {
      appendStreamingText(payload.content);
    });

    wsService.on('done', () => {
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
      payload: { role, content, timestamp: Date.now() }
    });
  };

  return { sendTranslation };
};
```

### Task 3.2: useStreamingText Hook (HOOK-002)
**文件**: `src/hooks/useStreamingText.ts`
**功能**: 流式文本缓冲优化

### Task 3.3: useCharacterCount Hook (HOOK-003)
**文件**: `src/hooks/useCharacterCount.ts`
**功能**: 实时字符计数(300ms防抖)

### Task 3.4: useClipboard Hook (HOOK-004)
**文件**: `src/hooks/useClipboard.ts`
**功能**: 复制到剪贴板

### Task 3.5: StreamBuffer 工具类 (PERF-001)
**文件**: `src/utils/StreamBuffer.ts`
**功能**: 流式文本缓冲器(50ms flush)

## 验证标准
- [ ] 所有Hooks可以正常使用
- [ ] 防抖和缓冲机制生效
- [ ] 性能优化达到预期

---
**创建时间**: 2026-02-09
