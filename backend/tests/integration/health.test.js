/**
 * 健康检查接口集成测试
 */
import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';

describe('GET /api/health', () => {
  test('应该返回 200 状态码', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  test('应该返回健康状态', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('应该包含所有必需字段', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('qwen');
  });

  test('时间戳应该是有效的 ISO 格式', async () => {
    const res = await request(app).get('/api/health');

    const timestamp = new Date(res.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  test('uptime 应该是正数', async () => {
    const res = await request(app).get('/api/health');

    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThan(0);
  });

  test('qwen 配置应该包含必需字段', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.qwen).toHaveProperty('configured');
    expect(res.body.qwen).toHaveProperty('model');
    expect(typeof res.body.qwen.configured).toBe('boolean');
    expect(typeof res.body.qwen.model).toBe('string');
  });

  test('environment 应该是有效的环境名称', async () => {
    const res = await request(app).get('/api/health');

    expect(['development', 'production', 'test']).toContain(res.body.environment);
  });
});
