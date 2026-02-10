# 后端开发任务 3.5: 实现日志记录中间件

## 任务信息
- **任务ID**: `L2-T5`
- **依赖**: `L1-T2` (logger)
- **并行组**: Group-3
- **预估工时**: 15分钟

## 任务目标
实现请求日志记录中间件,记录所有HTTP请求信息。

## 产出物
`backend/src/middleware/logger.js`

## 完整代码
```javascript
import logger from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  next();
}
```

## 验证标准
- [ ] 每个请求都被记录到日志
- [ ] 日志包含响应时间
- [ ] 日志格式符合 JSON 格式
- [ ] 日志文件正常写入

---
**创建时间**: 2026-02-09
