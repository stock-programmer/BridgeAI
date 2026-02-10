// backend/src/config/index.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录路径 (ES Module 方式)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({
  path: join(__dirname, '../../.env')
});

/**
 * 配置管理中心
 * 统一管理所有环境变量和配置项
 */
const config = {
  // ------------------------------------------
  // 服务器配置
  // ------------------------------------------
  server: {
    // 运行环境
    env: process.env.NODE_ENV || 'development',

    // 监听端口
    port: parseInt(process.env.PORT, 10) || 3000,

    // 允许的跨域来源
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // 是否为生产环境
    isProduction: process.env.NODE_ENV === 'production',

    // 是否为开发环境
    isDevelopment: process.env.NODE_ENV === 'development'
  },

  // ------------------------------------------
  // Qwen 大模型配置
  // ------------------------------------------
  qwen: {
    // API 密钥 (必填)
    apiKey: process.env.QWEN_API_KEY,

    // API 基础地址
    apiBase: 'https://dashscope.aliyuncs.com/api/v1',

    // 使用的模型
    model: process.env.QWEN_MODEL || 'qwen-plus',

    // 温度参数 (控制创造性)
    temperature: parseFloat(process.env.QWEN_TEMPERATURE) || 0.7,

    // 最大生成 Token 数
    maxTokens: parseInt(process.env.QWEN_MAX_TOKENS, 10) || 2000,

    // 请求超时时间 (毫秒)
    timeout: parseInt(process.env.QWEN_TIMEOUT, 10) || 30000,

    // Top-P 采样参数
    topP: 0.8
  },

  // ------------------------------------------
  // 限流配置
  // ------------------------------------------
  rateLimit: {
    // 时间窗口 (毫秒)
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15分钟

    // 最大请求次数
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
  },

  // ------------------------------------------
  // 日志配置
  // ------------------------------------------
  logging: {
    // 日志级别
    level: process.env.LOG_LEVEL || 'info',

    // 是否启用控制台输出
    enableConsole: process.env.NODE_ENV !== 'production'
  }
};

/**
 * 验证必需的配置项
 * 在应用启动前检查关键配置是否存在
 */
export function validateConfig() {
  const errors = [];

  // 检查 Qwen API Key
  if (!config.qwen.apiKey) {
    errors.push('QWEN_API_KEY 环境变量未设置');
  }

  // 检查 API Key 格式 (应以 sk- 开头)
  if (config.qwen.apiKey && !config.qwen.apiKey.startsWith('sk-')) {
    errors.push('QWEN_API_KEY 格式不正确,应以 "sk-" 开头');
  }

  // 检查端口号范围
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push(`PORT 端口号无效: ${config.server.port}`);
  }

  // 检查温度参数范围
  if (config.qwen.temperature < 0 || config.qwen.temperature > 2) {
    errors.push(`QWEN_TEMPERATURE 参数超出范围 [0, 2]: ${config.qwen.temperature}`);
  }

  // 如果有错误,抛出异常
  if (errors.length > 0) {
    throw new Error(
      `配置验证失败:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`
    );
  }

  return true;
}

/**
 * 打印当前配置 (脱敏)
 * 用于调试和日志记录
 */
export function printConfig() {
  return {
    server: {
      env: config.server.env,
      port: config.server.port,
      corsOrigin: config.server.corsOrigin
    },
    qwen: {
      apiKey: config.qwen.apiKey ? `${config.qwen.apiKey.substring(0, 8)}...` : 'NOT_SET',
      model: config.qwen.model,
      temperature: config.qwen.temperature,
      maxTokens: config.qwen.maxTokens
    },
    rateLimit: config.rateLimit,
    logging: config.logging
  };
}

// 默认导出配置对象
export default config;
