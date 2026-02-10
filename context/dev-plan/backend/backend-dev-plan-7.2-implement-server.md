# 后端开发任务 7.2: 实现服务器启动

## 任务信息
- **任务ID**: `L6-T2`
- **依赖**: `L6-T1` (app.js), `L1-T1` (config), `L1-T2` (logger)
- **并行组**: 独立（必须等待 Task 7.1）
- **预估工时**: 15分钟

## 任务目标
实现服务器启动逻辑，包括配置验证和优雅关闭。

## 产出物
`backend/src/server.js`

## 完整代码
```javascript
import app from './app.js';
import config, { validateConfig } from './config/index.js';
import logger from './utils/logger.js';

// 1. 验证配置
try {
  validateConfig();
  logger.info('配置验证通过');
} catch (error) {
  logger.error('配置验证失败', { error: error.message });
  process.exit(1);
}

// 2. 启动服务器
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  logger.info(`🚀 服务器启动成功`, {
    port: PORT,
    env: config.server.env,
    model: config.qwen.model,
    pid: process.pid
  });

  logger.info(`API 地址: http://localhost:${PORT}/api`);
  logger.info(`健康检查: http://localhost:${PORT}/api/health`);
});

// 3. 优雅关闭
const gracefulShutdown = (signal) => {
  logger.info(`收到 ${signal} 信号，开始优雅关闭...`);

  server.close(() => {
    logger.info('HTTP 服务器已关闭');
    process.exit(0);
  });

  // 强制关闭超时
  setTimeout(() => {
    logger.error('强制关闭超时，退出进程');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 4. 未捕获异常处理
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的 Promise 拒绝', { reason, promise });
  process.exit(1);
});

export default server;
```

## 启动流程
```
1. 加载配置
2. 验证配置 (validateConfig)
3. 启动 HTTP 服务器
4. 监听端口
5. 注册信号处理器 (SIGTERM/SIGINT)
6. 注册异常处理器
```

## 验证标准
- [ ] 服务器成功启动
- [ ] 配置验证生效
- [ ] 日志正确输出
- [ ] 可以接收 HTTP 请求
- [ ] Ctrl+C 可以优雅关闭

## 启动测试
```bash
# 启动开发服务器
npm run dev

# 测试健康检查
curl http://localhost:3000/api/health

# 测试翻译接口
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"role":"pm","content":"我要一个推荐系统"}'
```

---
**创建时间**: 2026-02-09
