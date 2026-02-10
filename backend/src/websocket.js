/**
 * WebSocket 服务器模块
 * 支持实时流式翻译
 */

import { WebSocketServer } from 'ws';
import llmService from './services/llm.service.js';
import logger from './utils/logger.js';

/**
 * 初始化 WebSocket 服务器
 * @param {Object} server - HTTP 服务器实例
 */
export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  logger.info('WebSocket 服务器已初始化');

  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    logger.info('WebSocket 客户端已连接', { clientIp });

    // 心跳检测
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // 处理消息
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'translate':
            await handleTranslate(ws, message.payload);
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', payload: { timestamp: Date.now() } }));
            break;
          default:
            logger.warn('未知的消息类型', { type: message.type });
            ws.send(JSON.stringify({
              type: 'error',
              payload: { error: '未知的消息类型' }
            }));
        }
      } catch (error) {
        logger.error('处理 WebSocket 消息失败', { error: error.message });
        ws.send(JSON.stringify({
          type: 'error',
          payload: { error: '消息格式错误' }
        }));
      }
    });

    // 处理连接关闭
    ws.on('close', () => {
      logger.info('WebSocket 客户端已断开', { clientIp });
    });

    // 处理错误
    ws.on('error', (error) => {
      logger.error('WebSocket 错误', { error: error.message, clientIp });
    });
  });

  // 心跳检测定时器
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        logger.info('客户端心跳超时，断开连接');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // 每30秒检测一次

  // 清理定时器
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  return wss;
}

/**
 * 处理翻译请求
 * @param {WebSocket} ws - WebSocket 连接
 * @param {Object} payload - 请求负载
 */
async function handleTranslate(ws, payload) {
  const { role, content } = payload;

  if (!role || !content) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { error: 'role 和 content 字段是必需的' }
    }));
    return;
  }

  if (!['pm', 'dev'].includes(role)) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { error: 'role 必须是 pm 或 dev' }
    }));
    return;
  }

  try {
    logger.info('开始 WebSocket 流式翻译', { role, contentLength: content.length });

    // 流式回调函数 - 发送增量内容
    const onChunk = (delta) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'chunk',
          payload: { content: delta }
        }));
      }
    };

    // 调用 LLM 服务进行流式翻译
    const fullContent = await llmService.translateStream(role, content, onChunk);

    // 发送完成信号
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'done',
        payload: { fullContent }
      }));
    }

    logger.info('WebSocket 流式翻译完成', { totalLength: fullContent.length });

  } catch (error) {
    logger.error('WebSocket 翻译失败', { error: error.message });

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        payload: { error: error.message }
      }));
    }
  }
}
