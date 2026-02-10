import app from './app.js';
import config, { validateConfig } from './config/index.js';
import logger from './utils/logger.js';
import { initWebSocket } from './websocket.js';

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
  logger.info(`WebSocket 地址: ws://localhost:${PORT}`);
});

// 3. 初始化 WebSocket
initWebSocket(server);

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
