# 前端开发任务 1.6: 工具函数-验证器

## 任务信息
- **任务ID**: `UTIL-002`
- **依赖**: `UTIL-001` (常量)
- **并行组**: Group-0
- **预估工时**: 10分钟

## 产出物
`src/utils/validation.ts`

## 完整代码
```typescript
import { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateInput = (text: string): ValidationResult => {
  // 1. 长度检查
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      error: '请输入内容'
    };
  }

  const trimmedLength = text.trim().length;

  if (trimmedLength < MIN_INPUT_LENGTH) {
    return {
      valid: false,
      error: `内容至少需要 ${MIN_INPUT_LENGTH} 个字符`
    };
  }

  if (trimmedLength > MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: `内容不能超过 ${MAX_INPUT_LENGTH} 个字符`
    };
  }

  // 2. XSS 基础防护
  const dangerousPattern = /<script|javascript:|onerror=/i;
  if (dangerousPattern.test(text)) {
    return {
      valid: false,
      error: '检测到非法字符，请检查输入内容'
    };
  }

  return { valid: true };
};

export const getCharacterCount = (text: string): number => {
  return text.trim().length;
};

export const isValidRole = (role: string | null): role is 'pm' | 'dev' => {
  return role === 'pm' || role === 'dev';
};
```

## 验证
- [ ] validateInput 对各种情况返回正确结果
- [ ] 边界条件测试通过

---
**创建时间**: 2026-02-09
