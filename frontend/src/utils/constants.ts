// 输入验证常量
export const MAX_INPUT_LENGTH = 5000;
export const MIN_INPUT_LENGTH = 10;

// 流式文本缓冲延迟 (ms)
export const STREAM_BUFFER_DELAY = 50;

// WebSocket 重连配置
export const WS_RECONNECT_MAX_RETRIES = 10;
export const WS_RECONNECT_DELAY = 3000;

// 角色配置
export const ROLES = {
  PM: {
    value: 'pm' as const,
    label: '我是产品经理',
    description: '描述你的需求或想法',
    placeholder: '例如:我需要一个用户推荐系统,能够根据用户行为推荐相关内容...'
  },
  DEV: {
    value: 'dev' as const,
    label: '我是开发工程师',
    description: '描述你的技术方案或改动',
    placeholder: '例如:优化了数据库查询,将N+1查询改为批量查询,QPS从100提升到500...'
  }
} as const;

// API 端点
export const API_ENDPOINTS = {
  TRANSLATE: '/api/translate',
  TRANSLATE_STREAM: '/api/translate/stream',
  HEALTH: '/api/health'
} as const;

export default {
  MAX_INPUT_LENGTH,
  MIN_INPUT_LENGTH,
  STREAM_BUFFER_DELAY,
  WS_RECONNECT_MAX_RETRIES,
  WS_RECONNECT_DELAY,
  ROLES,
  API_ENDPOINTS
};
