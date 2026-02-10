/**
 * Jest 测试设置文件
 * 在所有测试运行前执行的配置
 */

import { jest } from '@jest/globals';

// 设置环境变量
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.QWEN_API_KEY = 'test-api-key-for-unit-tests';
process.env.QWEN_MODEL = 'qwen-plus';
process.env.QWEN_TEMPERATURE = '0.7';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';

// 全局测试超时
jest.setTimeout(10000);

// 静默控制台输出（测试时）
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};
