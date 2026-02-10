# 后端开发任务 5.1: 实现翻译控制器

## 任务信息
- **任务ID**: `L4-T1`
- **依赖**: `L3-T1` (llmService), `L1-T2` (logger)
- **并行组**: 独立（Layer 4 只有1个任务）
- **预估工时**: 25分钟

## 任务目标
实现翻译接口的控制器层，处理 HTTP 请求和响应。

## 产出物
`backend/src/controllers/translate.controller.js`

## 核心功能
1. `translateStream(req, res)` - SSE 流式翻译接口
2. `translate(req, res, next)` - 常规 JSON 翻译接口

## 完整代码
```javascript
import llmService from '../services/llm.service.js';
import logger from '../utils/logger.js';

export async function translateStream(req, res) {
  const { role, content } = req.body;

  try {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    logger.info('开始流式翻译', { role, contentLength: content.length });

    // 流式回调
    const onChunk = (delta) => {
      res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
    };

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

export async function translate(req, res, next) {
  const { role, content } = req.body;

  try {
    logger.info('收到翻译请求', { role, contentLength: content.length });

    const result = await llmService.translate(role, content);

    res.json({
      success: true,
      data: {
        role,
        originalContent: content,
        translatedContent: result,
        timestamp: new Date().toISOString()
      }
    });

    logger.info('翻译成功');

  } catch (error) {
    next(error);
  }
}
```

## 验证标准
- [ ] SSE 响应头设置正确
- [ ] 流式数据格式符合前端要求
- [ ] 常规接口返回 JSON 格式正确
- [ ] 错误处理完善
- [ ] 日志记录完整

---
**创建时间**: 2026-02-09
