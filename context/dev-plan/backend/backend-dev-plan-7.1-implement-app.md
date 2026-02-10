# 后端开发任务 7.1: 实现 Express 应用

## 任务信息
- **任务ID**: `L6-T1`
- **依赖**: `L5-T3` (routes), `L2-T2` (errorHandler), `L2-T4` (rateLimiter), `L2-T5` (logger中间件)
- **并行组**: 独立（必须等待 Layer 5）
- **预估工时**: 20分钟

## 任务目标
组装 Express 应用，配置所有中间件和路由。

## 产出物
`backend/src/app.js`

## 完整代码
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { translateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

// 1. 安全中间件
app.use(helmet());

// 2. CORS 跨域配置
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));

// 3. 压缩响应
app.use(compression());

// 4. Body 解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. 请求日志
app.use(requestLogger);

// 6. 限流 (仅应用于 API 路由)
app.use('/api/translate', translateLimiter);

// 7. 挂载路由
app.use('/api', routes);

// 8. 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  });
});

// 9. 全局错误处理 (必须放在最后)
app.use(errorHandler);

export default app;
```

## 中间件执行顺序
```
1. helmet (安全头)
2. cors (跨域)
3. compression (压缩)
4. express.json (Body解析)
5. requestLogger (日志)
6. translateLimiter (限流)
7. routes (路由)
8. 404 handler
9. errorHandler (错误处理)
```

## 验证标准
- [ ] 应用可以成功创建
- [ ] 所有中间件正确加载
- [ ] 路由可以正常访问
- [ ] 404 和错误处理生效

---
**创建时间**: 2026-02-09
