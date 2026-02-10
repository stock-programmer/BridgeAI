/**
 * 翻译控制器
 * 处理翻译相关的 HTTP 请求
 */

import llmService from '../services/llm.service.js';
import logger from '../utils/logger.js';

/**
 * 流式翻译接口 (SSE)
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
export async function translateStream(req, res) {
  const { role, content } = req.body;

  try {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲

    logger.info('开始流式翻译', { role, contentLength: content.length });

    // 流式回调函数
    const onChunk = (delta) => {
      res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
    };

    // 调用 LLM 服务进行流式翻译
    const fullContent = await llmService.translateStream(role, content, onChunk);

    // 发送完成信号
    res.write(`data: ${JSON.stringify({ type: 'done', fullContent })}\n\n`);
    res.end();

    logger.info('流式翻译完成', { totalLength: fullContent.length });

  } catch (error) {
    logger.error('流式翻译失败', { error: error.message });
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
}

/**
 * 常规翻译接口 (JSON)
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
export async function translate(req, res, next) {
  const { role, content } = req.body;

  try {
    logger.info('收到翻译请求', { role, contentLength: content.length });

    // 调用 LLM 服务进行翻译
    const result = await llmService.translate(role, content);

    // 返回 JSON 响应
    res.json({
      success: true,
      data: {
        role,
        originalContent: content,
        translatedContent: result,
        timestamp: new Date().toISOString()
      }
    });

    logger.info('翻译成功', { resultLength: result.length });

  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
}
