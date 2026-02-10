# 前端开发任务 2.2: 状态管理Store-翻译

## 任务信息
- **任务ID**: `STORE-001`
- **依赖**: `TYPE-001` (状态类型)
- **并行组**: Group-1
- **预估工时**: 20分钟

## 产出物
`src/store/translationStore.ts`

## 核心功能
使用 Zustand 实现翻译状态管理

## 完整代码
```typescript
import { create } from 'zustand';
import type { TranslationState } from '@/types/translation';

export const useTranslationStore = create<TranslationState>((set) => ({
  role: null,
  inputText: '',
  translationResult: '',
  isStreaming: false,
  wsConnected: false,

  setRole: (role) => set({ role }),
  setInputText: (inputText) => set({ inputText }),
  appendStreamingText: (chunk) =>
    set((state) => ({
      translationResult: state.translationResult + chunk
    })),
  clearResult: () => set({ translationResult: '' }),
  setStreamingStatus: (isStreaming) => set({ isStreaming }),
  setWsStatus: (wsConnected) => set({ wsConnected })
}));
```

## 验证
- [ ] Store 可以被组件使用
- [ ] 状态更新正常
- [ ] 流式文本追加正确

---
**创建时间**: 2026-02-09
