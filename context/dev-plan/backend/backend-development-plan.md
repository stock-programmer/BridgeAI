# 后端开发计划 (DAG 任务依赖图)

> 本文档为 AI 执行的后端开发任务依赖图，采用 DAG（有向无环图）结构组织任务
> 每层任务内部可并行执行，但必须等待上一层所有任务完成后才能开始

---

## DAG 结构说明

```
Layer 0 (基础层) → Layer 1 (配置层) → Layer 2 (工具层) → Layer 3 (服务层)
    → Layer 4 (控制器层) → Layer 5 (路由层) → Layer 6 (应用层) → Layer 7 (测试层)
```

**并行度原则**: 同一层内的所有任务可并行执行，不同层之间必须按顺序执行

---

## Layer 0: 项目基础设施 (4个并行任务)

> **前置依赖**: 无
> **并行度**: 4
> **执行策略**: 可同时执行所有任务

### Task 0.1: 创建项目目录结构
**任务ID**: `L0-T1`
**依赖**: 无
**产出物**:
```
backend/
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── prompts/
├── tests/
│   ├── unit/
│   └── integration/
└── logs/
```

### Task 0.2: 创建 package.json
**任务ID**: `L0-T2`
**依赖**: 无
**产出物**: `backend/package.json`
**关键配置**:
- `"type": "module"` (ES6 模块)
- 依赖: express, axios, dotenv, cors, helmet, compression, winston, express-rate-limit, validator
- 开发依赖: nodemon, jest, supertest, eslint

### Task 0.3: 创建 .gitignore
**任务ID**: `L0-T3`
**依赖**: 无
**产出物**: `backend/.gitignore`
**内容**: node_modules/, logs/, .env, coverage/, dist/, *.log

### Task 0.4: 创建 .env.example
**任务ID**: `L0-T4`
**依赖**: 无
**产出物**: `backend/.env.example`
**关键变量**:
- NODE_ENV
- PORT
- CORS_ORIGIN
- QWEN_API_KEY
- QWEN_MODEL
- QWEN_TEMPERATURE
- QWEN_MAX_TOKENS
- QWEN_TIMEOUT
- LOG_LEVEL

---

## Layer 1: 配置与工具基础 (3个并行任务)

> **前置依赖**: Layer 0 所有任务
> **并行度**: 3
> **执行策略**: 等待 Layer 0 完成后，并行执行

### Task 1.1: 实现配置管理模块
**任务ID**: `L1-T1`
**依赖**: `L0-T2` (需要 dotenv 包)
**产出物**: `backend/src/config/index.js`
**功能**:
- 加载环境变量
- 导出 server、qwen、rateLimit 配置对象
- 提供类型安全的配置访问

### Task 1.2: 实现日志工具
**任务ID**: `L1-T2`
**依赖**: `L0-T2` (需要 winston 包)
**产出物**: `backend/src/utils/logger.js`
**功能**:
- Winston 日志器配置
- 支持 error.log 和 combined.log
- 开发环境控制台输出
- JSON 格式化 + 时间戳

### Task 1.3: 实现常量定义
**任务ID**: `L1-T3`
**依赖**: `L0-T1` (目录结构)
**产出物**: `backend/src/utils/constants.js`
**功能**:
- 定义角色常量 (ROLE_PM, ROLE_DEV)
- HTTP 状态码常量
- 错误消息模板
- 其他系统级常量

---

## Layer 2: 中间件与 Prompt (5个并行任务)

> **前置依赖**: Layer 1 所有任务
> **并行度**: 5
> **执行策略**: 等待 Layer 1 完成后，并行执行

### Task 2.1: 实现系统 Prompt 模块
**任务ID**: `L2-T1`
**依赖**: 无额外依赖
**产出物**: `backend/src/prompts/system-prompt.js`
**功能**:
- `getSystemPrompt()` - 返回系统提示词
- `buildUserPrompt(role, content)` - 构建用户消息
- 基于 context/system-prompt.md 实现

### Task 2.2: 实现错误处理中间件
**任务ID**: `L2-T2`
**依赖**: `L1-T2` (logger)
**产出物**: `backend/src/middleware/errorHandler.js`
**功能**:
- 全局错误捕获
- 日志记录
- 生产/开发环境差异化错误响应
- 状态码处理

### Task 2.3: 实现请求校验中间件
**任务ID**: `L2-T3`
**依赖**: `L0-T2` (validator 包)
**产出物**: `backend/src/middleware/validator.js`
**功能**:
- `validateTranslateRequest()` - 校验翻译请求
- 角色校验 (pm/dev)
- 内容长度限制 (10-2000字符)
- XSS 防护 (validator.escape)

### Task 2.4: 实现限流中间件
**任务ID**: `L2-T4`
**依赖**: `L1-T1` (config), `L0-T2` (express-rate-limit 包)
**产出物**: `backend/src/middleware/rateLimiter.js`
**功能**:
- 创建 translateLimiter
- 15分钟窗口，50次请求限制
- 自定义限流响应消息

### Task 2.5: 实现日志记录中间件
**任务ID**: `L2-T5`
**依赖**: `L1-T2` (logger)
**产出物**: `backend/src/middleware/logger.js`
**功能**:
- 请求日志记录
- 响应时间统计
- 请求ID追踪

---

## Layer 3: 核心服务层 (1个任务)

> **前置依赖**: Layer 2 所有任务
> **并行度**: 1
> **说明**: LLM 服务是核心服务，依赖多个模块

### Task 3.1: 实现 LLM 服务
**任务ID**: `L3-T1`
**依赖**: `L1-T1` (config), `L1-T2` (logger), `L2-T1` (prompts), `L0-T2` (axios 包)
**产出物**: `backend/src/services/llm.service.js`
**功能**:
- `validateConfig()` - 验证 API 配置
- `translateStream(role, content, onChunk)` - 流式翻译 (SSE)
- `translate(role, content)` - 非流式翻译
- `handleError(error)` - 统一错误处理
- Qwen API 调用封装
- 流式数据解析 (data: [DONE])

---

## Layer 4: 控制器层 (1个任务)

> **前置依赖**: Layer 3 所有任务
> **并行度**: 1

### Task 4.1: 实现翻译控制器
**任务ID**: `L4-T1`
**依赖**: `L3-T1` (llmService), `L1-T2` (logger)
**产出物**: `backend/src/controllers/translate.controller.js`
**功能**:
- `translateStream(req, res)` - 流式翻译接口处理
  - 设置 SSE 响应头
  - 调用 llmService.translateStream
  - 实时发送增量数据
  - 发送完成/错误信号
- `translate(req, res, next)` - 常规翻译接口处理
  - 调用 llmService.translate
  - 返回 JSON 响应

---

## Layer 5: 路由层 (3个并行任务)

> **前置依赖**: Layer 4 所有任务
> **并行度**: 3
> **执行策略**: 等待控制器完成后，并行创建所有路由

### Task 5.1: 实现翻译路由
**任务ID**: `L5-T1`
**依赖**: `L4-T1` (controller), `L2-T3` (validator)
**产出物**: `backend/src/routes/translate.routes.js`
**路由定义**:
- `POST /stream` → translateController.translateStream
- `POST /` → translateController.translate
- 均需通过 validateTranslateRequest 中间件

### Task 5.2: 实现健康检查路由
**任务ID**: `L5-T2`
**依赖**: `L1-T1` (config)
**产出物**: `backend/src/routes/health.routes.js`
**路由定义**:
- `GET /` → 返回系统健康状态
  - status: "ok"
  - timestamp
  - uptime
  - qwen.configured / qwen.model

### Task 5.3: 实现路由聚合
**任务ID**: `L5-T3`
**依赖**: `L5-T1`, `L5-T2`
**产出物**: `backend/src/routes/index.js`
**功能**:
- 聚合 translateRoutes (挂载到 /translate)
- 聚合 healthRoutes (挂载到 /health)
- 导出统一的 router

---

## Layer 6: 应用启动层 (2个串行任务)

> **前置依赖**: Layer 5 所有任务
> **并行度**: 0 (必须串行)
> **说明**: server.js 依赖 app.js

### Task 6.1: 实现 Express 应用
**任务ID**: `L6-T1`
**依赖**: `L5-T3` (routes), `L2-T2` (errorHandler), `L2-T4` (rateLimiter), `L2-T5` (logger 中间件)
**产出物**: `backend/src/app.js`
**功能**:
- 创建 Express 实例
- 应用中间件链:
  - helmet (安全头)
  - cors (跨域)
  - compression (Gzip)
  - express.json() (Body 解析)
  - logger 中间件
  - rateLimiter (限流)
- 挂载路由: `/api` → routes
- 挂载 errorHandler (必须在最后)
- 导出 app

### Task 6.2: 实现服务器启动
**任务ID**: `L6-T2`
**依赖**: `L6-T1` (app.js), `L1-T1` (config), `L1-T2` (logger)
**产出物**: `backend/src/server.js`
**功能**:
- 导入 app
- 监听配置的端口
- 启动成功日志
- 优雅关闭处理 (SIGTERM/SIGINT)

---

## Layer 7: 测试层 (2个并行任务)

> **前置依赖**: Layer 6 所有任务
> **并行度**: 2
> **说明**: 完整应用就绪后，可并行编写单元测试和集成测试

### Task 7.1: 实现单元测试
**任务ID**: `L7-T1`
**依赖**: Layer 6 所有任务
**产出物**:
- `backend/tests/unit/prompt.service.test.js`
- `backend/tests/unit/validator.test.js`
- `backend/tests/unit/logger.test.js`
**测试覆盖**:
- Prompt 构建逻辑
- 参数校验逻辑
- 日志工具

### Task 7.2: 实现集成测试
**任务ID**: `L7-T2`
**依赖**: Layer 6 所有任务
**产出物**:
- `backend/tests/integration/translate.test.js`
- `backend/tests/integration/health.test.js`
**测试覆盖**:
- 翻译接口端到端测试
- 健康检查接口测试
- 参数校验边界测试
- 错误处理测试

---

## DAG 可视化

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 0: 项目基础设施 (并行度: 4)                            │
│ [T1: 目录结构] [T2: package.json] [T3: .gitignore] [T4: .env.example] │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: 配置与工具基础 (并行度: 3)                          │
│ [T1: config] [T2: logger] [T3: constants]                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: 中间件与 Prompt (并行度: 5)                         │
│ [T1: system-prompt] [T2: errorHandler] [T3: validator]      │
│ [T4: rateLimiter] [T5: logger middleware]                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: 核心服务层 (并行度: 1)                              │
│ [T1: llm.service]                                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: 控制器层 (并行度: 1)                                │
│ [T1: translate.controller]                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: 路由层 (并行度: 3)                                  │
│ [T1: translate.routes] [T2: health.routes] [T3: routes/index] │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 6: 应用启动层 (串行: T1 → T2)                          │
│ [T1: app.js] → [T2: server.js]                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: 测试层 (并行度: 2)                                  │
│ [T1: 单元测试] [T2: 集成测试]                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 执行策略总结

### 并行执行点 (可同时进行的任务组)

1. **第一批并行**: Layer 0 所有任务 (4个)
2. **第二批并行**: Layer 1 所有任务 (3个)
3. **第三批并行**: Layer 2 所有任务 (5个)
4. **第四批串行**: Layer 3 的 LLM 服务 (1个)
5. **第五批串行**: Layer 4 的控制器 (1个)
6. **第六批并行**: Layer 5 任务 T1 和 T2 (2个)，然后 T3 (1个)
7. **第七批串行**: Layer 6 任务 T1 → T2
8. **第八批并行**: Layer 7 所有任务 (2个)

### 关键依赖链 (最长路径)

```
package.json → config → llm.service → controller → routes → app.js → server.js → 测试
```

**预估开发工作量**:
- 快速路径 (仅核心功能): ~3-4小时
- 完整实现 (含测试): ~6-8小时

---

## 执行检查点

每完成一个 Layer，需要验证:

1. ✅ **Layer 0**: 目录存在，package.json 可解析，依赖可安装
2. ✅ **Layer 1**: 配置可加载，日志可写入
3. ✅ **Layer 2**: 中间件可导入，Prompt 可生成
4. ✅ **Layer 3**: LLM 服务可实例化，API 密钥验证通过
5. ✅ **Layer 4**: 控制器方法存在
6. ✅ **Layer 5**: 路由可挂载
7. ✅ **Layer 6**: 服务器可启动，监听成功
8. ✅ **Layer 7**: 测试可运行，覆盖率达标

---

**文档版本**: v1.0
**生成时间**: 2026-02-09
**适用角色**: Claude Code AI
**执行模式**: 自动化顺序执行
