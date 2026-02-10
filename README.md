# BridgeAI - 产研职能沟通翻译助手

> 消除产品经理与开发工程师的认知壁垒，让商业语言与技术语言无缝转换

## 目录

- [项目概述](#项目概述)
- [核心功能](#核心功能)
- [项目演示](#项目演示)
- [智能翻译提示词设计](#智能翻译提示词设计)
- [快速开始](#快速开始)
- [技术架构](#技术架构)
- [测试用例](#测试用例)
- [项目文档](#项目文档)

---

## 项目概述

**BridgeAI** 是一个基于大语言模型的智能翻译助手，专注于产品经理（PM）与开发工程师（Dev）之间的职能沟通转换。它不是简单的语言翻译工具，而是深度理解业务需求与技术实现之间的鸿沟，提供结构化、专业化的翻译结果。

### 核心价值

- **商业转技术**：将模糊的业务需求转化为清晰的技术实现方案
- **技术转商业**：将复杂的技术方案转化为可理解的商业价值
- **推理与补全**：智能识别输入中缺失的关键信息并主动补充

---

## 核心功能

### 1. PM 模式（产品经理 → 开发工程师）

**输入示例**：
```
我们需要一个用户实时积分排行榜功能，希望能提升用户活跃度和留存率
```

**AI 翻译输出**：
```markdown
【致开发团队：技术实现拆解】

1. 核心技术挑战
   - 实时性要求（秒级更新）
   - 高并发读写（预估QPS 5000+）
   - 数据一致性保障

2. 推荐技术方案
   - Redis Sorted Set实现排行榜
   - 使用ZINCRBY命令原子更新积分
   - TTL机制控制榜单时效性

3. 数据链路设计
   [用户行为] → [积分计算服务] → [Redis排行榜] → [API查询]

4. 非功能性需求（NFR）
   - QPS目标：≥5000
   - 响应延迟：P99 < 100ms
   - 可用性：99.9%

5. 工作量预估
   - 后端开发：3人日
   - 前端开发：2人日
   - 测试与联调：1人日
   风险点：Redis容量规划需提前评估
```

### 2. Dev 模式（开发工程师 → 产品经理）

**输入示例**：
```
我们将订单模块微服务化，使用RabbitMQ实现消息队列解耦，提升了系统QPS 40%
```

**AI 翻译输出**：
```markdown
【致产品团队：商业价值与体验影响】

1. 用户体验升级
   - 支付流程更流畅（高峰期不再卡顿）
   - 订单确认速度提升40%
   - 双11等大促期间体验更稳定

2. 关键业务指标（ROI）
   - 支持订单量从10万/天提升到14万/天
   - 服务器成本节省约20%（按需扩容）
   - 系统宕机风险降低60%

3. 业务支持能力
   - 为秒杀、拼团等高并发活动提供基础
   - 支持未来3年业务增长预期

4. 长期架构价值
   - 模块解耦使新功能开发效率提升30%
   - 为国际化、多地域部署奠定基础
```

### 3. 流式输出（打字机效果）

- 使用 Server-Sent Events (SSE) 实现实时流式输出
- 提供沉浸式交互体验，实时查看 AI 翻译过程

---

## 项目演示

### 视频演示

项目根目录包含两个演示视频：

| 文件名 | 内容描述 | 大小 |
|--------|----------|------|
| **pm.mp4** | 产品经理视角的功能演示 | 944KB |
| **dev.mp4** | 开发工程师视角的功能演示 | 1.5MB |

### 在线演示

```bash
# 启动项目后访问
http://localhost:5173
```

---

## 智能翻译提示词设计

本项目的核心竞争力在于**结构化提示词工程**，采用四层设计框架：

### 设计思路

```
┌─────────────────────────────────────────────────────────────┐
│ 第1层：角色定义（Role）                                      │
├─────────────────────────────────────────────────────────────┤
│ • 身份：产研协作职能翻译官                                   │
│ • 背景：兼具商业洞察力和系统架构能力                         │
│ • 使命：消除PM与Dev的认知壁垒                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 第2层：核心能力定义（Core Competencies）                     │
├─────────────────────────────────────────────────────────────┤
│ • 商业转技术（PM → Dev）                                     │
│ • 技术转商业（Dev → PM）                                     │
│ • 推理与补全（智能识别缺失信息）                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 第3层：执行流程（Chain of Thought）                          │
├─────────────────────────────────────────────────────────────┤
│ Step 1: 角色识别                                             │
│   ├─ PM关键词：用户价值、转化率、DAU、留存率                 │
│   └─ Dev关键词：数据库、API、QPS、重构、算法                 │
│                                                              │
│ Step 2: 深度翻译                                             │
│   ├─ 场景A：商业需求 → 技术方案                             │
│   └─ 场景B：技术实现 → 商业价值                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 第4层：输出规范（Output Format）+ 约束（Constraints）        │
├─────────────────────────────────────────────────────────────┤
│ PM场景输出格式：                                             │
│   【致开发团队：技术实现拆解】                               │
│   1. 核心技术挑战                                            │
│   2. 推荐技术方案                                            │
│   3. 数据链路设计                                            │
│   4. 非功能性需求（NFR）                                     │
│   5. 工作量与风险预估                                        │
│                                                              │
│ Dev场景输出格式：                                            │
│   【致产品团队：商业价值与体验影响】                         │
│   1. 用户体验升级                                            │
│   2. 关键业务指标（ROI）                                     │
│   3. 业务支持能力                                            │
│   4. 长期架构价值                                            │
│                                                              │
│ 约束条件：                                                   │
│   • 保持专业、客观、建设性的语气                             │
│   • 避免过于生僻的技术术语                                   │
│   • 如输入信息不足，主动列出需确认的细节                     │
└─────────────────────────────────────────────────────────────┘
```

### 提示词关键要素

1. **角色定义（Role）**
   - 明确 AI 的身份和使命
   - 赋予跨职能沟通的专业能力

2. **思维链（Chain of Thought）**
   - 先识别用户角色（通过关键词语义分析）
   - 再执行相应的翻译逻辑
   - 确保输出的准确性和针对性

3. **输出格式（Output Format）**
   - 结构化输出，确保信息完整
   - PM/Dev 两种场景使用不同模板
   - 使用 Markdown 格式提升可读性

4. **约束条件（Constraints）**
   - 防止 AI 输出过于技术化或过于简化
   - 主动补全缺失信息
   - 保持输出风格的一致性

> 完整的系统提示词代码位于：`backend/src/prompts/system-prompt.js`

---

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm 或 yarn
- 阿里云千问（Qwen）API Key

### 1. 克隆项目

```bash
git clone <repository-url>
cd leishi
```

### 2. 后端配置与启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加千问 API Key
```

**配置千问 API Key**：

编辑 `backend/.env` 文件：

```bash
# 千问 API 密钥（必需）
QWEN_API_KEY=your_qwen_api_key_here

# 模型选择
QWEN_MODEL=qwen-plus

# 服务端口
PORT=3000

# 运行环境
NODE_ENV=development

# CORS 跨域配置
CORS_ORIGIN=http://localhost:5173
```

**获取千问 API Key**：
1. 访问[阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册并创建应用
3. 获取 API Key

**启动后端服务**：

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

后端服务将运行在 `http://localhost:3000`

### 3. 前端配置与启动

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env
# 默认后端地址为 http://localhost:3000/api
```

**编辑 `frontend/.env` 文件**（如需修改）：

```bash
VITE_API_URL=http://localhost:3000/api
```

**启动前端服务**：

```bash
npm run dev
```

前端应用将运行在 `http://localhost:5173`

### 4. 访问应用

在浏览器中打开 `http://localhost:5173`，即可开始使用！

### 5. 使用流程

1. 选择角色（产品经理 or 开发工程师）
2. 在左侧输入框输入内容
3. 点击"开始翻译"按钮
4. 右侧将实时流式显示翻译结果
5. 可以复制结果或清空重新开始

---

## 技术架构

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | >= 18.0.0 | 运行时环境 |
| Express | ^4.18.2 | Web 框架 |
| Axios | ^1.6.0 | HTTP 客户端 |
| Qwen | qwen-plus | 阿里云大模型 |
| helmet | ^7.1.0 | 安全响应头 |
| compression | ^1.7.4 | Gzip 压缩 |
| cors | ^2.8.5 | 跨域支持 |
| express-rate-limit | ^7.1.5 | API 限流 |
| winston | ^3.11.0 | 日志系统 |
| dotenv | ^16.3.1 | 环境变量管理 |

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19.2.0 | UI 框架 |
| TypeScript | ~5.9.3 | 类型安全 |
| Vite | ^7.3.1 | 构建工具 |
| Zustand | ^4.5.7 | 状态管理 |
| TailwindCSS | ^3.4.19 | CSS 框架 |
| react-markdown | ^9.1.0 | Markdown 渲染 |
| framer-motion | ^11.18.2 | 动画效果（打字机） |
| react-hot-toast | ^2.6.0 | 通知组件 |

### 架构图

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐     │
│  │ InputPanel │  │ RoleSelector│  │ ResultPanel         │     │
│  │            │  │ (PM/Dev)   │  │ (Streaming Text)    │     │
│  └────────────┘  └────────────┘  └─────────────────────┘     │
│         │                │                     ▲              │
│         └────────────────┴─────────────────────┘              │
│                          │                                    │
│                    Zustand Store                              │
│                   (translationStore)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP POST/SSE
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Backend (Express)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Router     │→ │  Controller  │→ │   LLM Service    │    │
│  │ /translate   │  │  translate   │  │  (Qwen API)      │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                            │                  │               │
│                            ▼                  ▼               │
│                    ┌────────────┐    ┌────────────────┐       │
│                    │  Prompt    │    │  Stream        │       │
│                    │  Service   │    │  Service (SSE) │       │
│                    └────────────┘    └────────────────┘       │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS Request
                           ▼
                ┌──────────────────────────┐
                │   Qwen LLM (qwen-plus)   │
                │   阿里云百炼平台          │
                └──────────────────────────┘
```

### API 接口

#### POST /api/translate/stream（推荐）

流式翻译接口，使用 Server-Sent Events (SSE)

**请求体**：
```json
{
  "role": "pm",  // 或 "dev"
  "content": "用户输入的内容"
}
```

**响应**：
```
Content-Type: text/event-stream

data: {"type":"chunk","payload":{"content":"【致开发团队"}}
data: {"type":"chunk","payload":{"content":"：技术实现拆解】\n\n"}}
data: {"type":"chunk","payload":{"content":"1. 核心技术挑战..."}}
...
data: {"type":"done","payload":{"totalTokens":1250}}
```

#### POST /api/translate

常规翻译接口，返回完整结果

**请求体**：
```json
{
  "role": "dev",
  "content": "我们优化了数据库查询，QPS提升了30%"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "translation": "【致产品团队：商业价值与体验影响】\n\n1. 用户体验升级...",
    "tokensUsed": 856
  }
}
```

---

## 测试用例

### case 目录结构

项目包含 4 个真实场景测试用例，展示翻译助手的能力：

```
case/
├── pm-case-1.md       # PM案例1：用户实时积分排行榜
├── pm-case-2.md       # PM案例2：提现环节人脸识别验证
├── dev-case-1.md      # Dev案例1：订单模块微服务化
└── dev-case-2.md      # Dev案例2：前端构建工具迁移
```

### 案例说明

#### PM 案例 1：用户实时积分排行榜

**输入**（产品经理视角）：
> 我们需要一个用户实时积分排行榜功能，希望能提升用户活跃度和留存率

**输出**（翻译给开发工程师）：
- 核心技术挑战：实时性、高并发、数据一致性
- 推荐方案：Redis Sorted Set + ZINCRBY 原子操作
- 数据链路设计：用户行为 → 积分服务 → Redis → API
- 性能指标：QPS ≥5000, P99 延迟 < 100ms
- 工作量预估：6 人日，风险点在 Redis 容量规划

#### PM 案例 2：提现环节人脸识别验证

**输入**：
> 为了防止盗刷，提现环节需要增加人脸识别验证

**输出**：
- 技术方案：活体检测 + 人脸比对（1:1）
- 推荐供应商：阿里云/腾讯云 Face API
- 用户体验设计：首次录入 + 验证流程优化
- 安全等级：金融级别（FAR < 0.001%）

#### Dev 案例 1：订单模块微服务化

**输入**（开发工程师视角）：
> 我们将订单模块微服务化，使用 RabbitMQ 实现消息队列解耦，提升了系统 QPS 40%

**输出**（翻译给产品经理）：
- 用户体验升级：支付流程更流畅，高峰期不卡顿
- 业务指标：订单处理能力从 10 万/天提升到 14 万/天
- 成本节省：服务器成本降低 20%
- 长期价值：为秒杀、拼团等高并发活动提供基础

#### Dev 案例 2：前端构建工具迁移

**输入**：
> 我们将构建工具从 Webpack 迁移到 Vite，开发环境启动速度提升 10 倍

**输出**：
- 用户感知：页面加载速度提升 30%
- 开发效率：新功能上线周期缩短 20%
- 业务影响：支持更快的 AB 测试迭代

### 运行测试用例

```bash
# 将 case 目录中的内容复制到应用中测试
# 或使用 curl 命令测试 API

curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "role": "pm",
    "content": "我们需要一个用户实时积分排行榜功能"
  }'
```

---

## 项目文档

### context 目录结构

`context/` 目录包含完整的项目规划、架构设计和开发文档：

```
context/
├── PRD.md                          # 产品需求文档
├── system-prompt.md                # 系统提示词说明
├── llm-qwen.js                     # Qwen LLM 集成参考
├── frontend-architecture.md        # 前端架构设计
├── backend-architecture.md         # 后端架构设计
└── dev-plan/                       # 开发计划（DAG 任务图）
    ├── DAG-TASKS-OVERVIEW.md       # DAG 任务执行总览
    ├── backend/                    # 后端开发计划（18个任务）
    │   ├── backend-dev-plan-1.x    # Layer 0: 基础设施
    │   ├── backend-dev-plan-2.x    # Layer 1: 配置和工具
    │   ├── backend-dev-plan-3.x    # Layer 2: 中间件和提示词
    │   ├── backend-dev-plan-4.x    # Layer 3: LLM 服务
    │   ├── backend-dev-plan-5.x    # Layer 4: 控制器
    │   ├── backend-dev-plan-6.x    # Layer 5: 路由
    │   ├── backend-dev-plan-7.x    # Layer 6: 应用和服务器
    │   └── backend-dev-plan-8.x    # Layer 7: 测试
    └── frontend/                   # 前端开发计划（32个任务）
        ├── frontend-dev-plan-1.x   # Layer 0: 项目初始化
        ├── frontend-dev-plan-2.x   # Layer 1: 状态管理和通信
        ├── frontend-dev-plan-3.x   # Layer 2: 自定义 Hooks
        ├── frontend-dev-plan-4.x   # Layer 3: React 组件
        ├── frontend-dev-plan-5.x   # Layer 4: 应用入口
        └── frontend-dev-plan-6.x   # Layer 5: 测试
```

### 核心文档说明

#### 1. PRD.md - 产品需求文档

包含：
- 项目背景：PM 与 Dev 的沟通鸿沟问题
- 用户角色定义：产品经理 vs 开发工程师
- 页面结构设计：双面板布局
- 功能需求：角色选择、翻译、历史记录等

#### 2. system-prompt.md - 系统提示词

详细说明了提示词的设计理念和实现细节，包括：
- 角色定义
- 核心能力
- 执行流程（Chain of Thought）
- 输出格式和约束条件

#### 3. 架构文档

**frontend-architecture.md**：
- 技术栈选择理由
- 组件设计模式
- 状态管理方案（Zustand）
- WebSocket 通信机制

**backend-architecture.md**：
- Node.js + Express 架构
- Qwen LLM 集成方案
- SSE 流式输出实现
- 中间件设计（日志、限流、错误处理）

#### 4. dev-plan/ - 开发计划（DAG 任务图）

采用**有向无环图（DAG）**组织开发任务：

- **后端 18 个任务**，分为 8 层
  - Layer 0: 基础设施（目录、package.json）
  - Layer 1-7: 依次构建配置、中间件、服务、路由、测试等

- **前端 32 个任务**，分为 6 层
  - Layer 0: 项目初始化（Vite、TypeScript）
  - Layer 1-5: 依次构建状态管理、Hooks、组件、应用入口、测试

每个任务文件包含：
- 任务ID和依赖关系
- 详细的实现步骤
- 验收标准

> **Claude Code 用户特别说明**：`context/` 目录中的文档是为 Claude Code AI 编程助手设计的项目规范，包含完整的产品需求、架构设计和 DAG 开发计划，帮助 AI 理解项目上下文并高效协作开发。

---

## 项目结构

```
leishi/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── app.js                    # Express 应用主文件
│   │   ├── server.js                 # HTTP 服务器启动
│   │   ├── config/                   # 配置管理
│   │   ├── routes/                   # API 路由
│   │   ├── controllers/              # 控制器
│   │   ├── services/                 # 业务服务
│   │   │   ├── llm.service.js        # Qwen LLM 核心服务
│   │   │   ├── prompt.service.js     # 提示词构建
│   │   │   └── stream.service.js     # SSE 流式服务
│   │   ├── middleware/               # 中间件
│   │   ├── prompts/                  # 提示词模板
│   │   │   └── system-prompt.js      # 核心系统提示词
│   │   └── utils/                    # 工具函数
│   ├── tests/                        # 测试文件
│   └── package.json
│
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/               # React 组件
│   │   │   ├── common/               # 通用组件
│   │   │   ├── layout/               # 布局组件
│   │   │   └── translation/          # 翻译相关组件
│   │   ├── hooks/                    # 自定义 Hooks
│   │   ├── services/                 # API 服务
│   │   ├── store/                    # Zustand 状态管理
│   │   │   └── translationStore.ts   # 翻译状态
│   │   ├── types/                    # TypeScript 类型
│   │   ├── utils/                    # 工具函数
│   │   ├── App.tsx                   # 根组件
│   │   └── main.tsx                  # 入口文件
│   ├── package.json
│   └── vite.config.ts
│
├── case/                    # 测试用例
│   ├── pm-case-1.md                  # PM案例：实时积分排行榜
│   ├── pm-case-2.md                  # PM案例：人脸识别验证
│   ├── dev-case-1.md                 # Dev案例：微服务化
│   └── dev-case-2.md                 # Dev案例：构建工具迁移
│
├── context/                 # 项目文档（Claude Code Spec）
│   ├── PRD.md                        # 产品需求文档
│   ├── system-prompt.md              # 提示词设计说明
│   ├── frontend-architecture.md      # 前端架构
│   ├── backend-architecture.md       # 后端架构
│   └── dev-plan/                     # DAG 开发计划
│       ├── DAG-TASKS-OVERVIEW.md
│       ├── backend/                  # 后端18个任务
│       └── frontend/                 # 前端32个任务
│
├── pm.mp4                   # 产品经理视角演示视频
├── dev.mp4                  # 开发工程师视角演示视频
└── README.md                # 项目说明文档（本文件）
```

---

## 常见问题

### 1. 如何获取千问 API Key？

访问[阿里云百炼平台](https://bailian.console.aliyun.com/)，注册并创建应用后获取 API Key。

### 2. 流式输出不工作怎么办？

检查：
- 后端是否正确配置 QWEN_API_KEY
- CORS 配置是否正确
- 浏览器控制台是否有错误信息

### 3. 如何自定义提示词？

编辑 `backend/src/prompts/system-prompt.js` 文件，修改系统提示词模板。

### 4. 如何部署到生产环境？

```bash
# 后端
cd backend
npm run build  # 如果有构建步骤
NODE_ENV=production npm start

# 前端
cd frontend
npm run build
# 将 dist/ 目录部署到静态服务器（Nginx、Vercel等）
```

### 5. 如何查看项目演示视频？

项目根目录的 `pm.mp4` 和 `dev.mp4` 可以直接下载查看，或使用任意视频播放器打开。

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证

本项目采用 MIT 许可证。

---

## 联系方式

如有问题或建议，欢迎通过 Issue 或邮件联系。

---

**祝使用愉快！让产品与技术沟通更高效！**
