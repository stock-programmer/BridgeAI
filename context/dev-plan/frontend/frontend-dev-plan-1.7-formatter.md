# 前端开发任务 1.7: 工具函数-格式化器

## 任务信息
- **任务ID**: `UTIL-003`
- **依赖**: 无
- **并行组**: Group-0
- **预估工时**: 10分钟

## 产出物
`src/utils/formatter.ts`

## 完整代码
```typescript
export const formatCharacterCount = (count: number, max: number): string => {
  return `${count} / ${max}`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};
```

## 验证
- [ ] 格式化函数输出正确
- [ ] 边界情况处理正确

---
**创建时间**: 2026-02-09
