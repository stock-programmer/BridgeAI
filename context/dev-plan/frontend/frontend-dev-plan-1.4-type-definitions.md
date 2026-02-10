# 前端开发任务 1.4: TypeScript类型定义

## 任务信息
- **任务ID**: `TYPE-001`
- **依赖**: 无
- **并行组**: Group-0
- **预估工时**: 15分钟

## 产出物
- `src/types/translation.ts`
- `src/types/websocket.ts`

## 完整代码

### src/types/translation.ts
```typescript
export type Role = 'pm' | 'dev';

export interface TranslationState {
  role: Role | null;
  inputText: string;
  translationResult: string;
  isStreaming: boolean;
  wsConnected: boolean;

  // Actions
  setRole: (role: Role) => void;
  setInputText: (text: string) => void;
  appendStreamingText: (chunk: string) => void;
  clearResult: () => void;
  setStreamingStatus: (status: boolean) => void;
  setWsStatus: (status: boolean) => void;
}
```

### src/types/websocket.ts
```typescript
export interface ClientMessage {
  type: 'translate';
  payload: {
    role: 'pm' | 'dev';
    content: string;
    timestamp: number;
  };
}

export interface ServerMessage {
  type: 'chunk' | 'done' | 'error';
  payload: {
    content?: string;
    error?: string;
    totalTokens?: number;
  };
}
```

## 验证
- [ ] TypeScript 编译无错误
- [ ] 类型可以被其他模块导入

---
**创建时间**: 2026-02-09
