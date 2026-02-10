# 后端开发任务 4.1: 实现 LLM 服务

## 任务信息
- **任务ID**: `L3-T1`
- **依赖**: `L1-T1` (config), `L1-T2` (logger), `L2-T1` (prompts), `L0-T2` (axios)
- **并行组**: 独立（Layer 3 只有1个任务）
- **预估工时**: 30-40分钟

## 任务目标
实现与 Qwen API 交互的服务层，支持流式和非流式翻译。

## 产出物
`backend/src/services/llm.service.js`

## 核心功能
1. `validateConfig()` - 验证 API 配置
2. `translateStream(role, content, onChunk)` - 流式翻译
3. `translate(role, content)` - 非流式翻译
4. `handleError(error)` - 统一错误处理

## 完整代码
详见 backend-architecture.md 第4.3节的完整实现。

## 关键实现要点

### 1. 流式响应处理
```javascript
response.data.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const jsonStr = line.slice(5).trim();
      if (jsonStr === '[DONE]') {
        resolve(fullContent);
        return;
      }
      const data = JSON.parse(jsonStr);
      const delta = data.output?.choices?.[0]?.message?.content || '';
      if (delta) {
        fullContent += delta;
        onChunk(delta);
      }
    }
  }
});
```

### 2. 错误处理
```javascript
handleError(error) {
  if (error.response?.status === 401) {
    throw new Error('API Key 无效');
  } else if (error.response?.status === 429) {
    throw new Error('API 调用频率超限');
  }
  throw new Error('翻译服务暂时不可用');
}
```

## 验证标准
- [ ] 能成功调用 Qwen API
- [ ] 流式响应正确解析
- [ ] 错误处理完善
- [ ] 日志记录完整
- [ ] API Key 验证生效

---
**创建时间**: 2026-02-09
