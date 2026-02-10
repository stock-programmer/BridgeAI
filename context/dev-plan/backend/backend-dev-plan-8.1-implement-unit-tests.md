# 后端开发任务 8.1: 实现单元测试

## 任务信息
- **任务ID**: `L7-T1`
- **依赖**: Layer 6 所有任务
- **并行组**: Group-7
- **预估工时**: 30分钟

## 任务目标
编写核心模块的单元测试。

## 产出物
- `backend/tests/unit/prompt.service.test.js`
- `backend/tests/unit/validator.test.js`
- `backend/tests/unit/constants.test.js`

## 测试覆盖范围
1. Prompt 构建逻辑
2. 参数校验逻辑
3. 常量定义

## 示例代码
```javascript
// tests/unit/prompt.service.test.js
import { buildUserPrompt, getSystemPrompt } from '../../src/prompts/system-prompt.js';

describe('Prompt Service', () => {
  test('should build PM prompt correctly', () => {
    const result = buildUserPrompt('pm', '测试内容');
    expect(result).toContain('产品经理');
    expect(result).toContain('测试内容');
  });

  test('should build Dev prompt correctly', () => {
    const result = buildUserPrompt('dev', '测试内容');
    expect(result).toContain('开发工程师');
  });

  test('should return system prompt', () => {
    const result = getSystemPrompt();
    expect(result).toContain('产研协作职能翻译官');
  });
});
```

## 验证标准
- [ ] 测试覆盖率 > 80%
- [ ] 所有测试通过
- [ ] npm test 命令正常运行

---
**创建时间**: 2026-02-09
