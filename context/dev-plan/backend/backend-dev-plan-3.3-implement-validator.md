# 后端开发任务 3.3: 实现请求校验中间件

## 任务信息
- **任务ID**: `L2-T3`
- **依赖**: `L0-T2` (validator 包)
- **并行组**: Group-3
- **预估工时**: 20分钟

## 任务目标
实现请求参数校验中间件,验证角色和内容有效性。

## 产出物
`backend/src/middleware/validator.js`

## 完整代码
```javascript
import validator from 'validator';
import { ROLE, HTTP_STATUS, ERROR_MESSAGES, VALIDATION } from '../utils/constants.js';

export function validateTranslateRequest(req, res, next) {
  const { role, content } = req.body;

  // 1. 校验角色
  if (!role || ![ROLE.PM, ROLE.DEV].includes(role)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_ROLE
    });
  }

  // 2. 校验内容
  if (!content || typeof content !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_REQUIRED
    });
  }

  // 3. 内容长度限制
  const trimmedContent = content.trim();
  if (trimmedContent.length < VALIDATION.MIN_CONTENT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_TOO_SHORT
    });
  }

  if (trimmedContent.length > VALIDATION.MAX_CONTENT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_TOO_LONG
    });
  }

  // 4. XSS 防护
  req.body.content = validator.escape(trimmedContent);

  next();
}
```

## 验证标准
- [ ] 角色必须是 pm 或 dev
- [ ] 内容长度在 10-2000 字符之间
- [ ] XSS 字符被正确转义
- [ ] 测试各种边界条件

---
**创建时间**: 2026-02-09
