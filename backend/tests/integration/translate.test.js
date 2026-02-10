/**
 * 翻译接口集成测试
 */
import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/translate - 参数校验', () => {
  test('应该拒绝缺少 role 字段', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ content: '测试内容，需要足够长才能通过验证' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('角色');
  });

  test('应该拒绝缺少 content 字段', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('内容');
  });

  test('应该拒绝无效的角色', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'invalid', content: '测试内容，需要足够长才能通过验证' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('角色');
  });

  test('应该拒绝过短的内容', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm', content: '短' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('过短');
  });

  test('应该拒绝过长的内容', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm', content: 'a'.repeat(5001) });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('过长');
  });

  test('应该拒绝非字符串的 role', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 123, content: '测试内容，需要足够长才能通过验证' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('应该拒绝非字符串的 content', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm', content: 123 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/translate - 正常流程', () => {
  test('应该接受 PM 角色的有效请求', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: '我需要一个用户推荐系统，能够根据用户行为推荐相关内容'
      });

    // 由于 API Key 可能无效，我们检查两种可能的情况
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('translation');
      expect(res.body.data).toHaveProperty('timestamp');
    } else {
      // API Key 无效的情况
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    }
  }, 30000); // 30秒超时

  test('应该接受 DEV 角色的有效请求', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'dev',
        content: '实现一个基于协同过滤的推荐算法，支持用户和物品的双向推荐'
      });

    // 检查两种可能的情况
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
    } else {
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    }
  }, 30000);

  test('应该接受边界长度的内容 (10 字符)', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: '1234567890' // 正好 10 个字符
      });

    expect([200, 500]).toContain(res.status);
    // 即使 API 调用失败，也应该通过验证阶段
  }, 30000);

  test('应该接受边界长度的内容 (2000 字符)', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: 'a'.repeat(2000) // 正好 2000 个字符（最大限制）
      });

    expect([200, 500]).toContain(res.status);
  }, 30000);

  test('应该拒绝超长内容 (5000 字符)', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: 'a'.repeat(5000) // 超过最大长度限制(2000)
      });

    // 应该被拒绝，因为超过了最大长度限制
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('过长');
  }, 30000);
});

describe('POST /api/translate - 响应格式', () => {
  test('成功响应应该包含必需字段', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: '我需要一个简单的登录功能，支持用户名密码登录'
      });

    if (res.status === 200) {
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('translation');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(typeof res.body.data.translation).toBe('string');
    }
  }, 30000);

  test('错误响应应该包含错误信息', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'invalid', content: '测试内容' });

    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('error');
    expect(res.body.success).toBe(false);
    expect(typeof res.body.error).toBe('string');
  });
});

describe('POST /api/translate - 其他测试', () => {
  test('应该正确处理中文内容', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: '我们需要开发一个移动应用，支持iOS和Android平台'
      });

    expect([200, 500]).toContain(res.status);
  }, 30000);

  test('应该正确处理包含特殊字符的内容', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'dev',
        content: '实现API接口：GET /api/users/{id}，返回JSON格式数据'
      });

    expect([200, 500]).toContain(res.status);
  }, 30000);

  test('应该拒绝空 JSON 对象', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('404 处理', () => {
  test('应该返回 404 对于不存在的路由', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('路径未找到');
  });

  test('应该返回 404 对于不存在的 POST 路由', async () => {
    const res = await request(app)
      .post('/api/nonexistent')
      .send({ test: 'data' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
