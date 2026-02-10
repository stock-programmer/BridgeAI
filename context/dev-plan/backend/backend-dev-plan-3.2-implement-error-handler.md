# 后端开发任务 3.2: 实现错误处理中间件

## 任务信息
- **任务ID**: `L2-T2`
- **依赖**: `L1-T2` (logger)
- **并行组**: Group-3
- **预估工时**: 15分钟

## 任务目标
实现全局错误处理中间件,统一捕获和处理应用错误。

## 产出物
`backend/src/middleware/errorHandler.js`

## 核心功能
```javascript
import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('全局错误捕获', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
```

## 验证
- [ ] 在 app.js 中作为最后一个中间件使用
- [ ] 错误被正确记录到日志
- [ ] 开发环境返回堆栈信息,生产环境不返回

---
**创建时间**: 2026-02-09
