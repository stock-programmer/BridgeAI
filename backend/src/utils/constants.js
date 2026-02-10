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
