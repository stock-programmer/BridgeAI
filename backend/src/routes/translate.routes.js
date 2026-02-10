/**
 * 翻译路由
 * 定义翻译相关的路由规则
 */

import express from 'express';
import * as translateController from '../controllers/translate.controller.js';
import { validateTranslateRequest } from '../middleware/validator.js';

const router = express.Router();

/**
 * POST /stream - 流式翻译接口 (SSE)
 *
 * 请求体:
 * {
 *   "role": "pm" | "dev",
 *   "content": "需要翻译的内容"
 * }
 *
 * 响应: Server-Sent Events (SSE)
 * - data: {"type":"delta","content":"..."}
 * - data: {"type":"done","fullContent":"..."}
 * - data: {"type":"error","message":"..."}
 */
router.post('/stream',
  validateTranslateRequest,
  translateController.translateStream
);

/**
 * POST / - 常规翻译接口 (JSON)
 *
 * 请求体:
 * {
 *   "role": "pm" | "dev",
 *   "content": "需要翻译的内容"
 * }
 *
 * 响应: JSON
 * {
 *   "success": true,
 *   "data": {
 *     "role": "pm",
 *     "originalContent": "...",
 *     "translatedContent": "...",
 *     "timestamp": "2026-02-09T12:00:00.000Z"
 *   }
 * }
 */
router.post('/',
  validateTranslateRequest,
  translateController.translate
);

export default router;
