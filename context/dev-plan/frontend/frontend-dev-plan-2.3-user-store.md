# 前端开发任务 2.3: 状态管理Store-用户

## 任务信息
- **任务ID**: `STORE-002`
- **依赖**: 无
- **并行组**: Group-1
- **预估工时**: 10分钟

## 产出物
`src/store/userStore.ts`

## 完整代码
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'zh' | 'en';
  };
  history: Array<{
    id: string;
    timestamp: number;
    role: 'pm' | 'dev';
    content: string;
  }>;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  addHistory: (item: any) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {
        theme: 'auto',
        language: 'zh'
      },
      history: [],
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme }
        })),
      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50) // 最多50条
        }))
    }),
    {
      name: 'user-storage'
    }
  )
);
```

## 验证
- [ ] 用户偏好可以持久化
- [ ] 历史记录正常存储

---
**创建时间**: 2026-02-09
