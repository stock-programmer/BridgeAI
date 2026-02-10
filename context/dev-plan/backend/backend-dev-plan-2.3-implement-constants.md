# 后端开发任务 2.3: 实现常量定义

## 任务信息
- **任务ID**: `L1-T3`
- **依赖**: `L0-T1` (目录结构)
- **并行组**: Group-2
- **预估工时**: 10分钟

## 任务目标
定义项目中使用的所有常量，包括角色、HTTP状态码、错误消息等。

## 产出物
`backend/src/utils/constants.js`

## 完整代码
```javascript
/**
 * 用户角色常量
 */
export const ROLE = {
  PM: 'pm',           // 产品经理
  DEV: 'dev'          // 开发工程师
};

/**
 * HTTP 状态码常量
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * 错误消息模板
 */
export const ERROR_MESSAGES = {
  INVALID_ROLE: '角色参数无效，必须是 pm 或 dev',
  CONTENT_REQUIRED: '内容参数不能为空',
  CONTENT_TOO_SHORT: '内容过短，建议至少输入 10 个字符',
  CONTENT_TOO_LONG: '内容过长，最多支持 2000 个字符',
  API_KEY_INVALID: 'API Key 无效，请检查配置',
  API_RATE_LIMIT: 'API 调用频率超限，请稍后再试',
  SERVICE_UNAVAILABLE: '翻译服务暂时不可用，请稍后重试',
  TIMEOUT: 'API 请求超时，请稍后重试'
};

/**
 * 输入验证常量
 */
export const VALIDATION = {
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 2000
};

/**
 * SSE 消息类型
 */
export const SSE_MESSAGE_TYPE = {
  DELTA: 'delta',     // 流式增量数据
  DONE: 'done',       // 完成信号
  ERROR: 'error'      // 错误信号
};

export default {
  ROLE,
  HTTP_STATUS,
  ERROR_MESSAGES,
  VALIDATION,
  SSE_MESSAGE_TYPE
};
```

## 使用示例
```javascript
import { ROLE, HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

if (role !== ROLE.PM && role !== ROLE.DEV) {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    error: ERROR_MESSAGES.INVALID_ROLE
  });
}
```

---
**创建时间**: 2026-02-09
