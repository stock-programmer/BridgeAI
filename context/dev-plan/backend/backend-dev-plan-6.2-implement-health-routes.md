# 后端开发任务 6.2: 实现健康检查路由

## 任务信息
- **任务ID**: `L5-T2`
- **依赖**: `L1-T1` (config)
- **并行组**: Group-6
- **预估工时**: 10分钟

## 任务目标
实现系统健康检查接口。

## 产出物
`backend/src/routes/health.routes.js`

## 完整代码
```javascript
import express from 'express';
import config from '../config/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    qwen: {
      configured: !!config.qwen.apiKey,
      model: config.qwen.model
    }
  });
});

export default router;
```

## 验证标准
- [ ] GET /health 返回 200 状态码
- [ ] 响应包含所有必需字段
- [ ] 健康检查不依赖外部服务

---
**创建时间**: 2026-02-09
