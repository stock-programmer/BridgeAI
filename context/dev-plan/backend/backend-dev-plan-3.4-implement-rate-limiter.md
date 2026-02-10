# 后端开发任务 3.4: 实现限流中间件

## 任务信息
- **任务ID**: `L2-T4`
- **依赖**: `L1-T1` (config), `L0-T2` (express-rate-limit)
- **并行组**: Group-3
- **预估工时**: 10分钟

## 任务目标
实现 API 限流中间件,防止恶意请求。

## 产出物
`backend/src/middleware/rateLimiter.js`

## 完整代码
```javascript
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const translateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: '请求过于频繁,请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: '请求过于频繁,请稍后再试'
    });
  }
});
```

## 验证标准
- [ ] 15分钟内超过限制后返回 429 错误
- [ ] 响应头包含 RateLimit-* 信息
- [ ] 限流计数器正常工作

---
**创建时间**: 2026-02-09
