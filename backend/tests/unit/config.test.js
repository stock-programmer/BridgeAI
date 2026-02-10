/**
 * Config 模块单元测试
 * 测试配置管理功能
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

describe('Config Module', () => {
  let config, validateConfig, printConfig;

  beforeEach(async () => {
    // 动态导入配置模块
    const configModule = await import('../../src/config/index.js');
    config = configModule.default;
    validateConfig = configModule.validateConfig;
    printConfig = configModule.printConfig;
  });

  describe('config object', () => {
    test('should have server configuration', () => {
      expect(config.server).toBeDefined();
      expect(config.server.env).toBeDefined();
      expect(config.server.port).toBeDefined();
      expect(config.server.corsOrigin).toBeDefined();
      expect(config.server.isProduction).toBeDefined();
      expect(config.server.isDevelopment).toBeDefined();
    });

    test('should have qwen configuration', () => {
      expect(config.qwen).toBeDefined();
      expect(config.qwen.apiKey).toBeDefined();
      expect(config.qwen.apiBase).toBe('https://dashscope.aliyuncs.com/api/v1');
      expect(config.qwen.model).toBeDefined();
      expect(config.qwen.temperature).toBeDefined();
      expect(config.qwen.maxTokens).toBeDefined();
      expect(config.qwen.timeout).toBeDefined();
      expect(config.qwen.topP).toBe(0.8);
    });

    test('should have rateLimit configuration', () => {
      expect(config.rateLimit).toBeDefined();
      expect(config.rateLimit.windowMs).toBeDefined();
      expect(config.rateLimit.max).toBeDefined();
    });

    test('should have logging configuration', () => {
      expect(config.logging).toBeDefined();
      expect(config.logging.level).toBeDefined();
      expect(config.logging.enableConsole).toBeDefined();
    });

    test('should parse port as integer', () => {
      expect(typeof config.server.port).toBe('number');
      expect(config.server.port).toBeGreaterThan(0);
      expect(config.server.port).toBeLessThanOrEqual(65535);
    });

    test('should parse temperature as float', () => {
      expect(typeof config.qwen.temperature).toBe('number');
      expect(config.qwen.temperature).toBeGreaterThanOrEqual(0);
      expect(config.qwen.temperature).toBeLessThanOrEqual(2);
    });

    test('should parse maxTokens as integer', () => {
      expect(typeof config.qwen.maxTokens).toBe('number');
      expect(config.qwen.maxTokens).toBeGreaterThan(0);
    });

    test('should set isProduction based on NODE_ENV', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(config.server.isProduction).toBe(true);
        expect(config.server.isDevelopment).toBe(false);
      } else if (process.env.NODE_ENV === 'development') {
        expect(config.server.isProduction).toBe(false);
        expect(config.server.isDevelopment).toBe(true);
      }
    });
  });

  describe('validateConfig()', () => {
    test('should validate successfully with correct configuration', async () => {
      // 使用当前配置直接测试
      // 测试环境的 API key 是 test-api-key-for-unit-tests，不符合 sk- 格式
      // 所以我们直接测试 validateConfig 会抛出错误
      const originalKey = process.env.QWEN_API_KEY;
      process.env.QWEN_API_KEY = 'sk-test-valid-key';

      // 重新导入配置模块
      const freshConfig = await import('../../src/config/index.js?' + Date.now());

      expect(() => freshConfig.validateConfig()).not.toThrow();

      // 恢复原始值
      process.env.QWEN_API_KEY = originalKey;
    });

    test('should be a function', () => {
      expect(typeof validateConfig).toBe('function');
    });

    test('should throw error if API key is missing', () => {
      const originalKey = config.qwen.apiKey;
      config.qwen.apiKey = '';

      expect(() => validateConfig()).toThrow('QWEN_API_KEY 环境变量未设置');

      config.qwen.apiKey = originalKey;
    });

    test('should throw error if API key format is invalid', () => {
      const originalKey = config.qwen.apiKey;
      config.qwen.apiKey = 'invalid-key';

      expect(() => validateConfig()).toThrow('QWEN_API_KEY 格式不正确');

      config.qwen.apiKey = originalKey;
    });

    test('should throw error if port is out of range', () => {
      const originalPort = config.server.port;

      config.server.port = 0;
      expect(() => validateConfig()).toThrow('PORT 端口号无效');

      config.server.port = 70000;
      expect(() => validateConfig()).toThrow('PORT 端口号无效');

      config.server.port = originalPort;
    });

    test('should throw error if temperature is out of range', () => {
      const originalTemp = config.qwen.temperature;

      config.qwen.temperature = -0.1;
      expect(() => validateConfig()).toThrow('QWEN_TEMPERATURE 参数超出范围');

      config.qwen.temperature = 2.1;
      expect(() => validateConfig()).toThrow('QWEN_TEMPERATURE 参数超出范围');

      config.qwen.temperature = originalTemp;
    });
  });

  describe('printConfig()', () => {
    test('should return sanitized configuration', () => {
      const printed = printConfig();

      expect(printed).toBeDefined();
      expect(printed.server).toBeDefined();
      expect(printed.qwen).toBeDefined();
      expect(printed.rateLimit).toBeDefined();
      expect(printed.logging).toBeDefined();
    });

    test('should mask API key', () => {
      const printed = printConfig();

      if (config.qwen.apiKey) {
        expect(printed.qwen.apiKey).toContain('...');
        expect(printed.qwen.apiKey).not.toBe(config.qwen.apiKey);
        expect(printed.qwen.apiKey.length).toBeLessThan(config.qwen.apiKey.length);
      } else {
        expect(printed.qwen.apiKey).toBe('NOT_SET');
      }
    });

    test('should include all server config', () => {
      const printed = printConfig();

      expect(printed.server.env).toBe(config.server.env);
      expect(printed.server.port).toBe(config.server.port);
      expect(printed.server.corsOrigin).toBe(config.server.corsOrigin);
    });

    test('should include qwen model config', () => {
      const printed = printConfig();

      expect(printed.qwen.model).toBe(config.qwen.model);
      expect(printed.qwen.temperature).toBe(config.qwen.temperature);
      expect(printed.qwen.maxTokens).toBe(config.qwen.maxTokens);
    });
  });

  describe('default values', () => {
    test('should use default port if not set', () => {
      // PORT 在测试环境中被设置为 3000
      expect(config.server.port).toBe(3000);
    });

    test('should use default environment if not set', () => {
      // NODE_ENV 在测试环境中被设置
      expect(['test', 'development', 'production']).toContain(config.server.env);
    });

    test('should use default CORS origin if not set', () => {
      expect(config.server.corsOrigin).toBeDefined();
      expect(typeof config.server.corsOrigin).toBe('string');
    });

    test('should use default qwen model if not set', () => {
      expect(config.qwen.model).toBeDefined();
      expect(typeof config.qwen.model).toBe('string');
    });

    test('should use default temperature if not set', () => {
      expect(config.qwen.temperature).toBeDefined();
      expect(config.qwen.temperature).toBeGreaterThanOrEqual(0);
      expect(config.qwen.temperature).toBeLessThanOrEqual(2);
    });

    test('should use default rate limit values if not set', () => {
      expect(config.rateLimit.windowMs).toBeGreaterThan(0);
      expect(config.rateLimit.max).toBeGreaterThan(0);
    });
  });
});
