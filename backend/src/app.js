/**
 * Express 应用主文件
 * 配置中间件、路由和错误处理
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { translateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logger.js';
import logger from './utils/logger.js';

const app = express();

/**
 * 1. 安全中间件配置
 * helmet 添加多种 HTTP 安全响应头
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

/**
 * 2. CORS 跨域配置
 * 允许前端跨域访问
 */
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 3. 压缩中间件
 * 压缩响应数据以减少传输大小
 */
app.use(compression());

/**
 * 4. 请求体解析中间件
 * 解析 JSON 和 URL 编码的请求体
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 5. 请求日志中间件
 * 记录所有 HTTP 请求
 */
app.use(requestLogger);

/**
 * 根路径欢迎信息
 */
app.get('/', (req, res) => {
  res.json({
    name: 'BridgeAI Backend API',
    version: '1.0.0',
    description: '产研职能沟通翻译助手',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      translate: 'POST /api/translate',
      translateStream: 'POST /api/translate/stream'
    }
  });
});

/**
 * 6. 速率限制中间件
 * 仅应用于翻译 API 路由
 */
app.use('/api/translate', translateLimiter);

/**
 * 7. 挂载 API 路由
 * 所有 API 路由都挂载在 /api 前缀下
 */
app.use('/api', routes);

/**
 * 8. 404 错误处理
 * 处理未匹配到的路由
 */
app.use((req, res, next) => {
  const error = new Error(`路径未找到: ${req.method} ${req.url}`);
  error.statusCode = 404;
  next(error);
});

/**
 * 9. 全局错误处理中间件
 * 捕获并处理所有错误（必须放在最后）
 */
app.use(errorHandler);

/**
 * 应用启动日志
 */
logger.info('Express 应用已配置', {
  environment: config.server.env,
  corsOrigin: config.server.corsOrigin,
  rateLimitWindow: `${config.rateLimit.windowMs / 1000 / 60}分钟`,
  rateLimitMax: `${config.rateLimit.max}次请求`
});

export default app;
