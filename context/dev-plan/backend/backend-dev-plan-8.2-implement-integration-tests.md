# 后端开发任务 8.2: 实现集成测试

## 任务信息
- **任务ID**: `L7-T2`
- **依赖**: Layer 6 所有任务
- **并行组**: Group-7
- **预估工时**: 40分钟

## 任务目标
编写 API 接口的集成测试。

## 产出物
- `backend/tests/integration/translate.test.js`
- `backend/tests/integration/health.test.js`

## 测试场景
1. 健康检查接口
2. 翻译接口参数校验
3. 翻译接口正常流程
4. 限流测试
5. 错误处理测试

## 示例代码
```javascript
// tests/integration/translate.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/translate', () => {
  test('应该拒绝无效的角色', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'invalid', content: '测试内容' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('应该拒绝过短的内容', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm', content: '短' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('过短');
  });

  test('应该接受有效的请求', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({
        role: 'pm',
        content: '我需要一个用户推荐系统，能够根据用户行为推荐相关内容'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000); // 30秒超时
});

describe('GET /api/health', () => {
  test('应该返回健康状态', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});
```

## 验证标准
- [ ] 所有接口测试通过
- [ ] 覆盖正常和异常情况
- [ ] 测试可重复运行

---
**创建时间**: 2026-02-09
