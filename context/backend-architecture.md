# 后端架构设计文档：产研职能沟通翻译助手 (BridgeAI)

| 文档版本 | 修改日期 | 修改描述 | 作者 |
| :--- | :--- | :--- | :--- |
| V1.0.0 | 2026-02-09 | 初始版本创建 | 技术架构师 |

---

## 1. 架构概览

### 1.1 系统定位
基于 Node.js + Express + Qwen 大模型构建的轻量级 AI 翻译服务，提供产品经理与开发工程师之间的职能语言双向翻译能力。

### 1.2 架构特点
- **轻量化**：无需复杂的数据库，使用文件系统存储会话历史（可选）
- **流式响应**：支持 Server-Sent Events (SSE) 实现打字机效果
- **无状态设计**：每次翻译请求独立处理，便于水平扩展
- **AI驱动**：基于阿里云通义千问 (Qwen) 大模型提供智能翻译

### 1.3 系统架构图
```
┌─────────────┐
│   浏览器     │
│  (用户端)    │
└──────┬──────┘
       │ HTTP/SSE
       ▼
┌─────────────────────────────────┐
│      Express 应用服务器          │
├─────────────────────────────────┤
│  ┌─────────┐    ┌─────────────┐ │
│  │ 路由层  │───▶│ 控制器层    │ │
│  └─────────┘    └──────┬──────┘ │
│                        │         │
│                        ▼         │
│              ┌─────────────────┐ │
│              │   服务层         │ │
│              │ - LLM Service   │ │
│              │ - Prompt Builder│ │
│              └────────┬────────┘ │
│                       │          │
└───────────────────────┼──────────┘
                        │ HTTPS
                        ▼
              ┌──────────────────┐
              │  阿里云 DashScope │
              │  Qwen 大模型 API  │
              └──────────────────┘
```

---

## 2. 技术栈选型

### 2.1 核心技术栈
| 技术 | 版本 | 用途 | 选型理由 |
|:---|:---|:---|:---|
| **Node.js** | >= 18.0.0 | 运行时环境 | 异步I/O适合AI流式响应，生态成熟 |
| **Express** | ^4.18.0 | Web框架 | 轻量、灵活、中间件丰富 |
| **Axios** | ^1.6.0 | HTTP客户端 | 支持Promise、拦截器、超时控制 |
| **Qwen (通义千问)** | qwen-plus | 大模型 | 中文能力强，响应速度快，成本适中 |

### 2.2 辅助依赖
| 依赖 | 用途 |
|:---|:---|
| `dotenv` | 环境变量管理 |
| `cors` | 跨域支持 |
| `helmet` | 安全响应头 |
| `compression` | Gzip压缩 |
| `winston` | 日志管理 |
| `express-rate-limit` | API限流 |
| `validator` | 输入校验 |

---

## 3. 目录结构设计

```
backend/
├── src/
│   ├── app.js                  # Express 应用入口
│   ├── server.js               # HTTP 服务器启动
│   ├── config/
│   │   ├── index.js            # 配置管理中心
│   │   └── qwen.config.js      # Qwen 模型配置
│   ├── routes/
│   │   ├── index.js            # 路由聚合
│   │   ├── translate.routes.js # 翻译接口路由
│   │   └── health.routes.js    # 健康检查路由
│   ├── controllers/
│   │   └── translate.controller.js  # 翻译控制器
│   ├── services/
│   │   ├── llm.service.js      # Qwen 大模型服务
│   │   ├── prompt.service.js   # Prompt 构建服务
│   │   └── stream.service.js   # SSE 流式服务
│   ├── middleware/
│   │   ├── errorHandler.js     # 全局错误处理
│   │   ├── validator.js        # 请求参数校验
│   │   ├── rateLimiter.js      # 限流中间件
│   │   └── logger.js           # 日志中间件
│   ├── utils/
│   │   ├── logger.js           # Winston 日志工具
│   │   └── constants.js        # 常量定义
│   └── prompts/
│       └── system-prompt.js    # 系统提示词模板
├── tests/
│   ├── unit/                   # 单元测试
│   └── integration/            # 集成测试
├── logs/                       # 日志目录
├── .env.example                # 环境变量模板
├── .env                        # 环境变量(不提交)
├── package.json
└── README.md
```

---

## 4. 核心模块设计

### 4.1 配置管理模块 (`config/index.js`)

```javascript
// config/index.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  // 服务配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },

  // Qwen 大模型配置
  qwen: {
    apiKey: process.env.QWEN_API_KEY,
    apiBase: 'https://dashscope.aliyuncs.com/api/v1',
    model: process.env.QWEN_MODEL || 'qwen-plus',
    temperature: parseFloat(process.env.QWEN_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.QWEN_MAX_TOKENS || '2000'),
    timeout: parseInt(process.env.QWEN_TIMEOUT || '30000')
  },

  // 限流配置
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 最多100次请求
  }
};
```

### 4.2 系统提示词模块 (`prompts/system-prompt.js`)

```javascript
// prompts/system-prompt.js
/**
 * 获取系统提示词
 * 基于 context/system-prompt.md 实现
 */
export function getSystemPrompt() {
  return `# Role: 产研协作职能翻译官 (Product-Tech Bridge Translator)

## Profile
你是一位兼具深厚商业洞察力和顶尖系统架构能力的资深技术产品专家。你的核心使命是消除产品经理（PM）与开发工程师（Dev）之间的认知壁垒。你能敏锐地识别输入内容的角色视角，并将其转化为对方能够理解、能够执行或能够感知的语言。

## Core Competencies
1. **商业转技术 (PM -> Dev)**: 将模糊的业务需求拆解为具象的技术实现路径、数据逻辑和非功能性需求。
2. **技术转商业 (Dev -> PM)**: 将枯燥的技术指标转化为用户体验提升、商业价值增长和成本效益分析。
3. **推理与补全**: 你不仅仅是翻译，你还会基于行业标准补全原话中缺失的关键信息。

## Workflow
### Step 1: 角色识别
分析输入文本的语义特征：
- 如果包含"用户价值"、"提升转化"、"新增功能"、"商业目标"等词汇，判定为 **[产品经理视角]**。
- 如果包含"数据库"、"API"、"QPS"、"重构"、"算法"、"延迟"等词汇，判定为 **[开发工程师视角]**。

### Step 2: 深度翻译 (思维转换)

#### 🟢 场景 A: 当输入为 [产品经理视角] 时
**输出格式**:
请以【致开发团队：技术实现拆解】为标题，包含以下模块：
- **核心技术挑战**: 一句话总结技术难点。
- **推荐技术方案**: 包含算法建议、架构调整建议。
- **数据链路**: 数据来源、处理方式（ETL/流式）、存储建议。
- **非功能性需求 (NFR)**: 性能要求（QPS/RT）、扩展性、安全性。
- **预估工作量与风险**: T恤尺码估算（S/M/L/XL）及潜在技术坑点。

#### 🔵 场景 B: 当输入为 [开发工程师视角] 时
**输出格式**:
请以【致产品团队：商业价值与体验影响】为标题，包含以下模块：
- **用户体验升级**: 直观描述用户能感知到的变化。
- **关键业务指标 (ROI)**: 预估对转化率、留存率或服务器成本的具体正面影响。
- **业务支持能力**: 现在支持哪些以前做不到的业务玩法。
- **长期价值**: 该技术投入带来的护城河或维护成本的降低。

## Constraints
- 保持语气专业、客观且具有建设性。
- 不要改变原意的核心目标，但必须扩展其内涵。
- 避免使用过于生僻的词汇，确保目标听众能瞬间秒懂。
- 如果输入过于简短，请列出需要确认的细节问题。`;
}

/**
 * 构建用户消息 Prompt
 */
export function buildUserPrompt(role, content) {
  const roleLabel = role === 'pm' ? '产品经理' : '开发工程师';

  return `【当前角色】: ${roleLabel}

【输入内容】:
${content}

【任务】:
请根据我的角色和输入内容，进行职能翻译，帮助对方职能的同事理解我的意图。`;
}
```

### 4.3 LLM 服务模块 (`services/llm.service.js`)

```javascript
// services/llm.service.js
import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { getSystemPrompt, buildUserPrompt } from '../prompts/system-prompt.js';

/**
 * Qwen LLM 服务类
 */
class LLMService {
  constructor() {
    this.apiBase = config.qwen.apiBase;
    this.apiKey = config.qwen.apiKey;
    this.model = config.qwen.model;
  }

  /**
   * 验证 API 配置
   */
  validateConfig() {
    if (!this.apiKey) {
      throw new Error('QWEN_API_KEY 未配置，请检查环境变量');
    }
  }

  /**
   * 流式翻译 (支持 SSE)
   * @param {string} role - 用户角色 (pm/dev)
   * @param {string} content - 用户输入内容
   * @param {Function} onChunk - 接收流式数据的回调
   * @returns {Promise<string>} 完整响应内容
   */
  async translateStream(role, content, onChunk) {
    this.validateConfig();

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(role, content);

    logger.info('开始流式翻译', {
      role,
      contentLength: content.length,
      model: this.model
    });

    const requestBody = {
      model: this.model,
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      },
      parameters: {
        temperature: config.qwen.temperature,
        top_p: 0.8,
        result_format: 'message',
        incremental_output: true  // 启用增量输出
      }
    };

    try {
      const response = await axios.post(
        `${this.apiBase}/services/aigc/text-generation/generation`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'enable'  // 启用 SSE
          },
          timeout: config.qwen.timeout,
          responseType: 'stream'  // 重要：设置为流式响应
        }
      );

      let fullContent = '';

      // 处理流式数据
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const jsonStr = line.slice(5).trim();
                if (jsonStr === '[DONE]') {
                  resolve(fullContent);
                  return;
                }

                const data = JSON.parse(jsonStr);
                const delta = data.output?.choices?.[0]?.message?.content || '';

                if (delta) {
                  fullContent += delta;
                  onChunk(delta);  // 回调发送增量数据
                }
              } catch (err) {
                logger.warn('解析流式数据失败', { line, error: err.message });
              }
            }
          }
        });

        response.data.on('end', () => {
          logger.info('流式翻译完成', { totalLength: fullContent.length });
          resolve(fullContent);
        });

        response.data.on('error', (error) => {
          logger.error('流式响应错误', { error: error.message });
          reject(error);
        });
      });

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 非流式翻译 (常规接口)
   * @param {string} role - 用户角色 (pm/dev)
   * @param {string} content - 用户输入内容
   * @returns {Promise<string>} 翻译结果
   */
  async translate(role, content) {
    this.validateConfig();

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(role, content);

    logger.info('开始翻译', { role, contentLength: content.length });

    const requestBody = {
      model: this.model,
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      },
      parameters: {
        temperature: config.qwen.temperature,
        top_p: 0.8,
        result_format: 'message',
        max_tokens: config.qwen.maxTokens
      }
    };

    try {
      const response = await axios.post(
        `${this.apiBase}/services/aigc/text-generation/generation`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: config.qwen.timeout
        }
      );

      const result = response.data.output?.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error('API 未返回有效内容');
      }

      logger.info('翻译成功', { resultLength: result.length });
      return result;

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 统一错误处理
   */
  handleError(error) {
    logger.error('Qwen API 调用失败', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      throw new Error('API Key 无效，请检查 QWEN_API_KEY 配置');
    } else if (error.response?.status === 429) {
      throw new Error('API 调用频率超限，请稍后再试');
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data?.message || '请求参数错误';
      throw new Error(`API 请求错误: ${errorMsg}`);
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('API 请求超时，请稍后重试');
    }

    throw new Error('翻译服务暂时不可用，请稍后重试');
  }
}

export default new LLMService();
```

### 4.4 翻译控制器 (`controllers/translate.controller.js`)

```javascript
// controllers/translate.controller.js
import llmService from '../services/llm.service.js';
import logger from '../utils/logger.js';

/**
 * 流式翻译接口 (SSE)
 */
export async function translateStream(req, res) {
  const { role, content } = req.body;

  try {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲

    logger.info('开始流式翻译请求', { role, contentLength: content.length });

    // 流式回调：发送增量数据
    const onChunk = (delta) => {
      res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
    };

    // 调用 LLM 服务
    const fullContent = await llmService.translateStream(role, content, onChunk);

    // 发送完成信号
    res.write(`data: ${JSON.stringify({ type: 'done', fullContent })}\n\n`);
    res.end();

    logger.info('流式翻译完成', { totalLength: fullContent.length });

  } catch (error) {
    logger.error('流式翻译失败', { error: error.message });

    // SSE 错误处理
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: error.message
    })}\n\n`);
    res.end();
  }
}

/**
 * 常规翻译接口 (JSON)
 */
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
    next(error);  // 传递给错误处理中间件
  }
}
```

### 4.5 路由定义 (`routes/translate.routes.js`)

```javascript
// routes/translate.routes.js
import express from 'express';
import * as translateController from '../controllers/translate.controller.js';
import { validateTranslateRequest } from '../middleware/validator.js';

const router = express.Router();

/**
 * POST /api/translate/stream
 * 流式翻译接口 (SSE)
 */
router.post('/stream',
  validateTranslateRequest,
  translateController.translateStream
);

/**
 * POST /api/translate
 * 常规翻译接口 (JSON)
 */
router.post('/',
  validateTranslateRequest,
  translateController.translate
);

export default router;
```

### 4.6 参数校验中间件 (`middleware/validator.js`)

```javascript
// middleware/validator.js
import validator from 'validator';

/**
 * 校验翻译请求参数
 */
export function validateTranslateRequest(req, res, next) {
  const { role, content } = req.body;

  // 1. 校验角色
  if (!role || !['pm', 'dev'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: '角色参数无效，必须是 pm 或 dev'
    });
  }

  // 2. 校验内容
  if (!content || typeof content !== 'string') {
    return res.status(400).json({
      success: false,
      error: '内容参数不能为空'
    });
  }

  // 3. 内容长度限制
  const trimmedContent = content.trim();
  if (trimmedContent.length < 10) {
    return res.status(400).json({
      success: false,
      error: '内容过短，建议至少输入 10 个字符'
    });
  }

  if (trimmedContent.length > 2000) {
    return res.status(400).json({
      success: false,
      error: '内容过长，最多支持 2000 个字符'
    });
  }

  // 4. XSS 防护
  req.body.content = validator.escape(trimmedContent);

  next();
}
```

### 4.7 错误处理中间件 (`middleware/errorHandler.js`)

```javascript
// middleware/errorHandler.js
import logger from '../utils/logger.js';

/**
 * 全局错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  logger.error('全局错误捕获', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // 默认 500 错误
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
```

---

## 5. API 接口设计

### 5.1 流式翻译接口 (推荐)

**接口信息**
- **URL**: `POST /api/translate/stream`
- **Content-Type**: `application/json`
- **Response-Type**: `text/event-stream`

**请求体**
```json
{
  "role": "pm",
  "content": "我希望在用户下单后，能实时推送订单状态给用户"
}
```

**响应示例 (SSE 流)**
```
data: {"type":"delta","content":"【致开发"}

data: {"type":"delta","content":"团队：技术实现"}

data: {"type":"delta","content":"拆解】\n\n## 核心技术"}

data: {"type":"done","fullContent":"...完整内容..."}
```

**错误响应**
```
data: {"type":"error","message":"API Key 无效"}
```

### 5.2 常规翻译接口

**接口信息**
- **URL**: `POST /api/translate`
- **Content-Type**: `application/json`
- **Response-Type**: `application/json`

**请求体**
```json
{
  "role": "dev",
  "content": "我们将数据库查询从 N+1 优化为批量查询，QPS 从 100 提升到 500"
}
```

**成功响应**
```json
{
  "success": true,
  "data": {
    "role": "dev",
    "originalContent": "...",
    "translatedContent": "【致产品团队：商业价值与体验影响】...",
    "timestamp": "2026-02-09T10:30:00.000Z"
  }
}
```

**错误响应**
```json
{
  "success": false,
  "error": "内容过短，建议至少输入 10 个字符"
}
```

### 5.3 健康检查接口

**URL**: `GET /api/health`

**响应**
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T10:30:00.000Z",
  "uptime": 3600,
  "qwen": {
    "configured": true,
    "model": "qwen-plus"
  }
}
```

---

## 6. 数据流设计

### 6.1 流式翻译数据流

```
┌─────────┐
│  用户   │
└────┬────┘
     │ 1. POST /api/translate/stream
     │    { role: "pm", content: "..." }
     ▼
┌─────────────────┐
│ Express Router  │
└────┬────────────┘
     │ 2. 参数校验 (validator)
     ▼
┌─────────────────┐
│  Controller     │
└────┬────────────┘
     │ 3. 设置 SSE 响应头
     │ 4. 调用 llmService.translateStream()
     ▼
┌─────────────────┐
│  LLM Service    │
└────┬────────────┘
     │ 5. 构建 Prompt (system + user)
     │ 6. 调用 Qwen API (streaming)
     ▼
┌──────────────────┐
│  Qwen API       │
│  (DashScope)    │
└────┬─────────────┘
     │ 7. 流式返回 SSE 数据
     ▼
┌─────────────────┐
│  LLM Service    │
│  (解析流数据)    │
└────┬────────────┘
     │ 8. 每收到一个 chunk
     │    onChunk(delta)
     ▼
┌─────────────────┐
│  Controller     │
└────┬────────────┘
     │ 9. res.write("data: {...}\n\n")
     ▼
┌─────────┐
│  用户   │ 10. 浏览器接收 SSE 事件
└─────────┘     逐字渲染 (打字机效果)
```

---

## 7. 部署方案

### 7.1 环境变量配置 (`.env`)

```bash
# 服务配置
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# Qwen API 配置
QWEN_API_KEY=sk-xxxxxxxxxxxxxx
QWEN_MODEL=qwen-plus
QWEN_TEMPERATURE=0.7
QWEN_MAX_TOKENS=2000
QWEN_TIMEOUT=30000

# 日志配置
LOG_LEVEL=info
```

### 7.2 生产部署架构

```
┌──────────────┐
│   Nginx      │  (反向代理 + SSL)
│   :443       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   PM2        │  (进程管理 + 负载均衡)
│   Cluster    │  ├─ Node Instance 1 :3000
│              │  ├─ Node Instance 2 :3001
│              │  └─ Node Instance 3 :3002
└──────────────┘
```

### 7.3 Nginx 配置示例

```nginx
upstream bridgeai_backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 443 ssl http2;
    server_name api.bridgeai.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://bridgeai_backend;
        proxy_http_version 1.1;

        # SSE 支持
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;

        # 超时设置
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;

        # 转发头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 7.4 PM2 配置 (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [{
    name: 'bridgeai-backend',
    script: 'src/server.js',
    instances: 3,  // 3个实例
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
```

### 7.5 Docker 部署 (可选)

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

**docker-compose.yml**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

---

## 8. 安全性设计

### 8.1 安全措施清单

| 安全项 | 实现方式 | 优先级 |
|:---|:---|:---|
| **HTTPS** | Nginx SSL 证书 | P0 |
| **CORS 限制** | 配置白名单域名 | P0 |
| **输入校验** | validator 库 + 长度限制 | P0 |
| **XSS 防护** | `validator.escape()` | P0 |
| **API 限流** | express-rate-limit | P1 |
| **敏感信息保护** | .env 文件 + .gitignore | P0 |
| **日志脱敏** | Winston 自定义格式化 | P1 |
| **错误信息隐藏** | 生产环境不返回堆栈 | P1 |

### 8.2 限流策略

```javascript
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 50, // 每个IP最多50次请求
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

---

## 9. 监控与日志

### 9.1 日志级别定义

| 级别 | 用途 | 示例 |
|:---|:---|:---|
| **error** | 系统错误、API失败 | Qwen API 调用失败 |
| **warn** | 非预期情况 | 输入内容过短 |
| **info** | 业务关键节点 | 翻译请求开始/完成 |
| **debug** | 调试信息 | Prompt 内容、响应详情 |

### 9.2 日志示例

```javascript
// utils/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### 9.3 关键指标监控

建议监控以下指标（可集成 Prometheus + Grafana）：

- **QPS**: 每秒请求数
- **响应时间**: P50/P95/P99
- **错误率**: 4xx/5xx 占比
- **Qwen API 调用量**: 成本控制
- **SSE 连接数**: 并发监控

---

## 10. 测试策略

### 10.1 测试金字塔

```
        ┌───────┐
        │  E2E  │  (Postman/Newman)
        └───────┘
      ┌───────────┐
      │ 集成测试  │  (Supertest)
      └───────────┘
    ┌───────────────┐
    │   单元测试    │  (Jest/Mocha)
    └───────────────┘
```

### 10.2 单元测试示例

```javascript
// tests/unit/prompt.service.test.js
import { buildUserPrompt } from '../../src/prompts/system-prompt.js';

describe('Prompt Service', () => {
  test('should build PM prompt correctly', () => {
    const result = buildUserPrompt('pm', '我要个推荐系统');
    expect(result).toContain('产品经理');
    expect(result).toContain('我要个推荐系统');
  });

  test('should build Dev prompt correctly', () => {
    const result = buildUserPrompt('dev', '优化了数据库索引');
    expect(result).toContain('开发工程师');
  });
});
```

### 10.3 集成测试示例

```javascript
// tests/integration/translate.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/translate', () => {
  test('should return 400 for invalid role', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'invalid', content: 'test' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('should return 400 for short content', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ role: 'pm', content: '短' });

    expect(res.status).toBe(400);
  });
});
```

---

## 11. 性能优化

### 11.1 优化策略

| 优化项 | 方案 | 预期收益 |
|:---|:---|:---|
| **响应压缩** | Gzip/Brotli | 减少 60% 传输体积 |
| **连接池** | Axios KeepAlive | 减少 TCP 握手 |
| **缓存** | Redis (可选) | 相同请求秒级响应 |
| **并发控制** | PM2 Cluster | 多核 CPU 利用 |

### 11.2 缓存设计 (可选)

```javascript
// 使用 Redis 缓存相同的翻译请求
import crypto from 'crypto';

function getCacheKey(role, content) {
  return crypto
    .createHash('md5')
    .update(`${role}:${content}`)
    .digest('hex');
}

// 在 translate() 方法中：
const cacheKey = getCacheKey(role, content);
const cached = await redis.get(cacheKey);
if (cached) {
  logger.info('命中缓存');
  return cached;
}

// ... 调用 Qwen API ...

await redis.setex(cacheKey, 3600, result); // 缓存1小时
```

---

## 12. 扩展性设计

### 12.1 多模型支持

未来可轻松扩展支持其他大模型：

```javascript
// services/llm-factory.js
export function createLLMService(provider) {
  switch (provider) {
    case 'qwen':
      return new QwenService();
    case 'openai':
      return new OpenAIService();
    case 'claude':
      return new ClaudeService();
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

### 12.2 历史记录功能

可选功能：保存用户翻译历史

```javascript
// models/translation.model.js (MongoDB Schema 示例)
const translationSchema = new Schema({
  userId: String,
  role: { type: String, enum: ['pm', 'dev'] },
  originalContent: String,
  translatedContent: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 7*24*60*60*1000 }
});

translationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 13. 故障排查指南

### 13.1 常见问题

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| **401 Unauthorized** | API Key 错误 | 检查 `.env` 中 `QWEN_API_KEY` |
| **429 Too Many Requests** | 调用频率超限 | 升级 API 套餐或增加限流 |
| **超时** | 网络延迟或模型响应慢 | 增加 `QWEN_TIMEOUT` 值 |
| **SSE 断连** | Nginx 缓冲导致 | 配置 `proxy_buffering off` |

### 13.2 健康检查脚本

```bash
#!/bin/bash
# health-check.sh

ENDPOINT="http://localhost:3000/api/health"
RESPONSE=$(curl -s $ENDPOINT)

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
  echo "✓ Service is healthy"
  exit 0
else
  echo "✗ Service is unhealthy"
  echo "$RESPONSE"
  exit 1
fi
```

---

## 14. 成本估算

### 14.1 Qwen API 定价 (参考)

| 模型 | 输入价格 | 输出价格 | 适用场景 |
|:---|:---|:---|:---|
| qwen-turbo | 0.3元/百万tokens | 0.6元/百万tokens | 测试环境 |
| qwen-plus | 0.8元/百万tokens | 2元/百万tokens | 生产推荐 |
| qwen-max | 4元/百万tokens | 12元/百万tokens | 高精度需求 |

### 14.2 月成本估算

假设：
- 日均翻译请求：1000次
- 平均输入：200 tokens
- 平均输出：500 tokens
- 使用模型：qwen-plus

**月成本计算**：
```
输入成本 = 1000 * 30 * 200 / 1,000,000 * 0.8 = 4.8元
输出成本 = 1000 * 30 * 500 / 1,000,000 * 2 = 30元
合计 ≈ 35元/月
```

---

## 15. 版本演进规划

### V1.0 (MVP)
- ✅ 基础翻译功能 (PM/Dev 双向)
- ✅ 流式响应 (SSE)
- ✅ 参数校验与限流
- ✅ 基础日志与监控

### V1.1 (增强)
- 🔲 Redis 缓存
- 🔲 用户历史记录
- 🔲 多语言支持 (国际化)
- 🔲 翻译质量评分

### V2.0 (智能化)
- 🔲 上下文记忆 (多轮对话)
- 🔲 自定义术语库
- 🔲 翻译模板管理
- 🔲 协作工作台 (PM + Dev 实时协作)

---

## 附录 A：完整 package.json

```json
{
  "name": "bridgeai-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "产研职能沟通翻译助手后端服务",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "validator": "^13.11.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "supertest": "^6.3.3"
  }
}
```

---

## 附录 B：Git 忽略规则

```gitignore
# .gitignore
node_modules/
logs/
.env
.DS_Store
*.log
coverage/
dist/
```

---

## 联系方式

如有问题，请联系：
- **技术支持**: tech@bridgeai.com
- **文档仓库**: https://github.com/yourusername/bridgeai-backend

---

**文档结束**
