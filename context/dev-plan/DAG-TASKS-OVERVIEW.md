# DAG 任务执行总览

## 文档说明
本文档汇总了前后端所有开发任务的 DAG 结构和执行策略，为 AI 自动化开发提供清晰的执行路线图。

---

## 📁 任务文件目录结构

```
context/dev-plan/
├── backend/
│   ├── backend-dev-plan-1.1-create-directory-structure.md
│   ├── backend-dev-plan-1.2-create-package-json.md
│   ├── backend-dev-plan-1.3-create-gitignore.md
│   ├── backend-dev-plan-1.4-create-env-example.md
│   ├── backend-dev-plan-2.1-implement-config-module.md
│   ├── backend-dev-plan-2.2-implement-logger.md
│   ├── backend-dev-plan-2.3-implement-constants.md
│   ├── backend-dev-plan-3.1-implement-system-prompt.md (待创建)
│   ├── backend-dev-plan-3.2-implement-error-handler.md
│   ├── backend-dev-plan-3.3-implement-validator.md
│   ├── backend-dev-plan-3.4-implement-rate-limiter.md
│   ├── backend-dev-plan-3.5-implement-logger-middleware.md
│   ├── backend-dev-plan-4.1-implement-llm-service.md
│   ├── backend-dev-plan-5.1-implement-translate-controller.md
│   ├── backend-dev-plan-6.1-implement-translate-routes.md
│   ├── backend-dev-plan-6.2-implement-health-routes.md
│   ├── backend-dev-plan-6.3-implement-routes-index.md
│   ├── backend-dev-plan-7.1-implement-app.md
│   ├── backend-dev-plan-7.2-implement-server.md
│   ├── backend-dev-plan-8.1-implement-unit-tests.md
│   └── backend-dev-plan-8.2-implement-integration-tests.md
└── frontend/
    ├── frontend-dev-plan-1.1-project-init.md
    ├── frontend-dev-plan-1.2-env-config.md
    ├── frontend-dev-plan-1.3-directory-structure.md
    ├── frontend-dev-plan-1.4-type-definitions.md
    ├── frontend-dev-plan-1.5-constants.md
    ├── frontend-dev-plan-1.6-validation.md
    ├── frontend-dev-plan-1.7-formatter.md
    ├── frontend-dev-plan-1.8-global-styles.md
    ├── frontend-dev-plan-2.1-websocket-service.md
    ├── frontend-dev-plan-2.2-translation-store.md
    ├── frontend-dev-plan-2.3-user-store.md
    ├── frontend-dev-plan-3.1-3.5-custom-hooks.md
    ├── frontend-dev-plan-4.1-4.7-components.md
    ├── frontend-dev-plan-5.1-5.3-application.md
    └── frontend-dev-plan-6.1-6.3-testing.md
```

---

## 🔄 后端 DAG 执行流程

### Layer 0: 基础设施层 (4个并行任务)
```
┌─────────────────────────────────────────────────┐
│  1.1 目录结构  1.2 package.json  1.3 .gitignore  │
│                  1.4 .env.example                │
└──────────────────────┬──────────────────────────┘
                       ▼
```

**执行命令**:
```bash
# 可以同时执行所有任务
mkdir -p backend && cd backend
# 按照各任务文档创建文件和目录
```

### Layer 1: 配置与工具基础 (3个并行任务)
```
┌─────────────────────────────────────────┐
│  2.1 config  2.2 logger  2.3 constants  │
└──────────────────┬──────────────────────┘
                   ▼
```

**依赖**: Layer 0 全部完成
**执行**: 创建 src/config/index.js, src/utils/logger.js, src/utils/constants.js

### Layer 2: 中间件与 Prompt (5个并行任务)
```
┌──────────────────────────────────────────────────────┐
│  3.1 system-prompt  3.2 errorHandler  3.3 validator  │
│       3.4 rateLimiter  3.5 logger middleware         │
└────────────────────────┬─────────────────────────────┘
                         ▼
```

**依赖**: Layer 1 全部完成

### Layer 3: 核心服务层 (1个任务)
```
┌──────────────────┐
│  4.1 llm.service │
└────────┬─────────┘
         ▼
```

**依赖**: Layer 2 全部完成

### Layer 4: 控制器层 (1个任务)
```
┌───────────────────────────┐
│  5.1 translate.controller │
└────────────┬──────────────┘
             ▼
```

**依赖**: Layer 3 完成

### Layer 5: 路由层 (2个并行 + 1个串行)
```
┌────────────────────────────────────┐
│  6.1 translate.routes  6.2 health  │
└────────────┬───────────────────────┘
             ▼
     ┌──────────────┐
     │  6.3 routes/ │
     │     index    │
     └──────┬───────┘
            ▼
```

**依赖**: Layer 4 完成

### Layer 6: 应用启动层 (2个串行任务)
```
┌──────────┐      ┌────────────┐
│  7.1 app │  →   │  7.2 server│
└──────────┘      └─────┬──────┘
                        ▼
```

**依赖**: Layer 5 全部完成
**执行顺序**: 必须串行 (7.1 → 7.2)

### Layer 7: 测试层 (2个并行任务)
```
┌──────────────────────────────┐
│  8.1 单元测试  8.2 集成测试  │
└──────────────────────────────┘
```

**依赖**: Layer 6 全部完成

---

## 🎨 前端 DAG 执行流程

### Layer 0: 基础设施层 (8个并行任务)
```
┌────────────────────────────────────────────────────┐
│  1.1 项目初始化  1.2 环境变量  1.3 目录结构        │
│  1.4 类型定义    1.5 常量      1.6 验证器          │
│  1.7 格式化器    1.8 全局样式                      │
└────────────────────────┬───────────────────────────┘
                         ▼
```

### Layer 1: 核心服务层 (3个并行任务)
```
┌──────────────────────────────────────────────┐
│  2.1 WebSocket服务  2.2 翻译Store  2.3 用户Store │
└───────────────────────┬──────────────────────┘
                        ▼
```

### Layer 2: 抽象层 (5个并行任务)
```
┌─────────────────────────────────────────────────┐
│  3.1 useWebSocket  3.2 useStreamingText         │
│  3.3 useCharacterCount  3.4 useClipboard        │
│  3.5 StreamBuffer                               │
└────────────────────┬────────────────────────────┘
                     ▼
```

### Layer 3: 组件层 (7个并行任务)
```
┌──────────────────────────────────────────────────┐
│  4.1 Button  4.2 TextArea  4.3 RoleSelector      │
│  4.4 Header  4.5 Footer  4.6 StreamingText       │
│  4.7 InputPanel                                  │
└────────────────────┬─────────────────────────────┘
                     ▼
```

### Layer 4: 应用层 (3个串行任务)
```
┌──────────────┐    ┌─────────┐    ┌──────────┐
│ 5.1 Result   │ →  │ 5.2 App │ →  │ 5.3 main │
│    Panel     │    │         │    │   .tsx   │
└──────────────┘    └─────────┘    └────┬─────┘
                                         ▼
```

### Layer 5: 质量保障层 (3个并行任务)
```
┌──────────────────────────────────────┐
│  6.1 单元测试  6.2 组件测试  6.3 E2E │
└──────────────────────────────────────┘
```

---

## 🚀 执行策略建议

### 并行执行原则
1. **最大并行度**: Layer 0 后端4个 + 前端8个 = 12个任务可同时开始
2. **分层推进**: 完成一层后立即启动下一层的所有并行任务
3. **资源分配**: 前后端可以由不同的 AI Agent 同时开发

### 关键路径 (最长依赖链)

**后端关键路径** (8个层级):
```
Layer 0 → Layer 1 → Layer 2 → Layer 3 → Layer 4 → Layer 5 → Layer 6 → Layer 7
```

**前端关键路径** (6个层级):
```
Layer 0 → Layer 1 → Layer 2 → Layer 3 → Layer 4 → Layer 5
```

### 预估总工时

| 项目 | Layer数 | 总任务数 | 预估时间 |
|------|---------|---------|---------|
| **后端** | 8层 | 20个任务 | 6-8小时 |
| **前端** | 6层 | 26个任务 | 8-10小时 |
| **总计** | - | 46个任务 | **14-18小时** |

注: 如果前后端并行开发，总时间可压缩至 **8-10小时**

---

## ✅ 验证检查点

### 后端验证
- [ ] Layer 0: `npm install` 成功
- [ ] Layer 1: 配置验证通过
- [ ] Layer 2: 中间件可导入
- [ ] Layer 3: LLM 服务可调用 Qwen API
- [ ] Layer 4: 控制器方法存在
- [ ] Layer 5: 路由可挂载
- [ ] Layer 6: 服务器启动成功，`curl http://localhost:3000/api/health` 返回200
- [ ] Layer 7: `npm test` 通过，覆盖率 > 80%

### 前端验证
- [ ] Layer 0: `npm run dev` 成功启动
- [ ] Layer 1: Store 和 Service 可用
- [ ] Layer 2: Hooks 可调用
- [ ] Layer 3: 组件可独立渲染
- [ ] Layer 4: 应用完整运行
- [ ] Layer 5: 所有测试通过

---

## 📋 任务命名规范说明

### 后端任务命名
```
backend-dev-plan-{层级}.{序号}-{任务描述}.md
```
- **层级**: 1-8 (对应 Layer 0-7)
- **序号**: 1-N (该层内的任务序号)
- **示例**: `backend-dev-plan-1.1-create-directory-structure.md`

### 前端任务命名
```
frontend-dev-plan-{层级}.{序号}-{任务描述}.md
```
- **层级**: 1-6 (对应 Layer 0-5)
- **序号**: 1-N (该层内的任务序号)
- **示例**: `frontend-dev-plan-1.1-project-init.md`

### 文件组织原则
- 同一层级的任务使用相同的层级编号
- 可并行的任务在文件名中无特殊标记
- 必须串行的任务在文档内明确说明依赖关系

---

## 🎯 下一步行动

### 对于 AI Agent
1. 按照层级顺序执行任务
2. 每完成一个 Layer，验证检查点
3. 遇到错误立即修复，不影响后续任务
4. 记录实际执行时间，优化预估

### 对于开发者
1. 克隆项目后，从 `backend-dev-plan-1.1` 和 `frontend-dev-plan-1.1` 开始
2. 参考每个任务文档中的详细步骤
3. 使用验证标准确保质量
4. 完成后可直接进入测试阶段

---

**文档版本**: V1.0
**创建时间**: 2026-02-09
**维护策略**: 随项目进展更新实际执行情况
