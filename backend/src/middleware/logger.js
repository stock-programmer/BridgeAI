/**
 * HTTP 请求日志记录中间件
 * 记录每个请求的详细信息和响应时间
 */

import logger from '../utils/logger.js';

/**
 * 请求日志记录中间件
 * 记录所有 HTTP 请求的详细信息
 *
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
export function requestLogger(req, res, next) {
  // 记录请求开始时间
  const startTime = Date.now();

  // 监听响应完成事件
  res.on('finish', () => {
    // 计算请求处理时长
    const duration = Date.now() - startTime;

    // 记录请求日志
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  // 继续处理请求
  next();
}

/**
 * 错误请求日志记录
 * 记录导致错误的请求信息（用于错误处理中间件）
 *
 * @param {Error} err - 错误对象
 * @param {Object} req - Express 请求对象
 */
export function logErrorRequest(err, req) {
  logger.error('HTTP Request Error', {
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
}

export default requestLogger;
