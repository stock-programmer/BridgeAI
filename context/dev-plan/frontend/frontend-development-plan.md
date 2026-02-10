# 前端开发计划 (DAG执行路线图)

## 文档说明

本文档是基于 `frontend-architecture.md` 生成的开发执行计划，专为 Claude Code AI 自动化开发设计。

**核心特点：**
- 采用有向无环图（DAG）结构组织任务
- 每个任务节点清晰标注依赖关系
- 相同层级的任务可以并行执行
- 按层级顺序执行，确保依赖正确性

---

## DAG 层级结构总览

```
Layer 0 (基础设施层 - 7个并行任务)
  ├── Layer 1 (核心服务层 - 3个并行任务)
  │     ├── Layer 2 (抽象层 - 5个并行任务)
  │     │     ├── Layer 3 (组件层 - 7个并行任务)
  │     │     │     ├── Layer 4 (应用层 - 2个串行任务)
  │     │     │     │     └── Layer 5 (质量保障层 - 3个并行任务)
```

---

## Layer 0: 基础设施层 (Foundation Layer)

**特点：** 无依赖，所有任务可以完全并行执行

### Task 0.1: 项目初始化和配置
- **任务ID:** `INIT-001`
- **描述:** 初始化项目脚手架，配置构建工具
- **依赖:** 无
- **并行组:** Group-0
- **交付物:**
  - `package.json` (包含所有依赖)
  - `tsconfig.json` (TypeScript配置)
  - `vite.config.ts` (Vite构建配置)
  - `tailwind.config.js` (Tailwind CSS配置)
  - `.gitignore`
  - `README.md`
- **关键依赖包:**
  ```json
  {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0"
  }
  ```

### Task 0.2: 环境变量配置
- **任务ID:** `ENV-001`
- **描述:** 创建开发和生产环境配置
- **依赖:** 无
- **并行组:** Group-0
- **交付物:**
  - `.env.development`
  - `.env.production`
- **内容:**
  ```bash
  # .env.development
  VITE_WS_URL=ws://localhost:3000
  VITE_API_URL=http://localhost:3000/api

  # .env.production
  VITE_WS_URL=wss://api.bridgeai.com
  VITE_API_URL=https://api.bridgeai.com/api
  ```

### Task 0.3: 目录结构创建
- **任务ID:** `STRUCT-001`
- **描述:** 创建完整的项目目录结构
- **依赖:** 无
- **并行组:** Group-0
- **交付物:** 完整的空目录结构
  ```
  src/
  ├── assets/images/
  ├── components/common/
  ├── components/layout/
  ├── components/translation/
  ├── hooks/
  ├── services/
  ├── store/
  ├── types/
  ├── utils/
  └── styles/
  ```

### Task 0.4: TypeScript类型定义
- **任务ID:** `TYPE-001`
- **描述:** 定义所有TypeScript类型和接口
- **依赖:** 无
- **并行组:** Group-0
- **交付物:**
  - `src/types/translation.ts`
  - `src/types/websocket.ts`
- **关键类型:**
  - `ClientMessage`
  - `ServerMessage`
  - `TranslationState`
  - `Role` ('pm' | 'dev')

### Task 0.5: 工具函数-常量定义
- **任务ID:** `UTIL-001`
- **描述:** 定义项目常量
- **依赖:** 无
- **并行组:** Group-0
- **交付物:** `src/utils/constants.ts`
- **内容:**
  - `MAX_INPUT_LENGTH = 5000`
  - `MIN_INPUT_LENGTH = 10`
  - `STREAM_BUFFER_DELAY = 50`
  - `WS_RECONNECT_MAX_RETRIES = 10`

### Task 0.6: 工具函数-验证器
- **任务ID:** `UTIL-002`
- **描述:** 实现输入验证逻辑
- **依赖:** `UTIL-001` (常量定义)
- **并行组:** Group-0
- **交付物:** `src/utils/validation.ts`
- **核心函数:** `validateInput(text: string)`

### Task 0.7: 工具函数-格式化器
- **任务ID:** `UTIL-003`
- **描述:** 实现文本格式化工具
- **依赖:** 无
- **并行组:** Group-0
- **交付物:** `src/utils/formatter.ts`
- **核心函数:**
  - `formatCharacterCount(count: number)`
  - `formatTimestamp(timestamp: number)`

### Task 0.8: 全局样式配置
- **任务ID:** `STYLE-001`
- **描述:** 配置全局样式和CSS变量
- **依赖:** 无
- **并行组:** Group-0
- **交付物:**
  - `src/styles/globals.css`
  - `src/styles/variables.css`
- **内容:**
  - CSS变量定义（颜色、字体、间距）
  - 全局重置样式
  - Tailwind指令导入

---

## Layer 1: 核心服务层 (Core Service Layer)

**特点：** 依赖Layer 0的类型定义和常量，3个任务可以并行执行

### Task 1.1: WebSocket服务封装
- **任务ID:** `SERVICE-001`
- **描述:** 封装WebSocket通信服务
- **依赖:** `TYPE-001` (WebSocket类型), `UTIL-001` (常量)
- **并行组:** Group-1
- **交付物:** `src/services/websocket.ts`
- **核心类:** `WebSocketService`
- **关键功能:**
  - 连接管理（自动重连）
  - 消息发送/接收
  - 事件监听器管理
  - 错误处理

### Task 1.2: 状态管理Store-翻译
- **任务ID:** `STORE-001`
- **描述:** 实现翻译功能的状态管理
- **依赖:** `TYPE-001` (状态类型)
- **并行组:** Group-1
- **交付物:** `src/store/translationStore.ts`
- **使用:** Zustand
- **状态字段:**
  - `role`, `inputText`, `translationResult`
  - `isStreaming`, `wsConnected`
- **操作方法:**
  - `setRole`, `setInputText`, `appendStreamingText`
  - `clearResult`, `setStreamingStatus`, `setWsStatus`

### Task 1.3: 状态管理Store-用户
- **任务ID:** `STORE-002`
- **描述:** 实现用户相关状态管理（预留扩展）
- **依赖:** 无
- **并行组:** Group-1
- **交付物:** `src/store/userStore.ts`
- **状态字段:**
  - 用户偏好设置
  - 历史记录（可选）

---

## Layer 2: 抽象层 (Abstraction Layer)

**特点：** 依赖Layer 1的服务和状态管理，5个任务可以并行执行

### Task 2.1: 自定义Hook-WebSocket
- **任务ID:** `HOOK-001`
- **描述:** 封装WebSocket连接和消息处理逻辑
- **依赖:** `SERVICE-001`, `STORE-001`
- **并行组:** Group-2
- **交付物:** `src/hooks/useWebSocket.ts`
- **返回值:** `{ sendTranslation }`
- **功能:**
  - 自动连接WebSocket
  - 处理流式消息接收
  - 自动清理连接

### Task 2.2: 自定义Hook-流式文本
- **任务ID:** `HOOK-002`
- **描述:** 处理流式文本的缓冲和渲染优化
- **依赖:** `STORE-001`, `UTIL-001`
- **并行组:** Group-2
- **交付物:** `src/hooks/useStreamingText.ts`
- **功能:**
  - 文本分块缓冲（50ms批量更新）
  - 防止频繁渲染

### Task 2.3: 自定义Hook-字符计数
- **任务ID:** `HOOK-003`
- **描述:** 实时统计输入字符数（带防抖）
- **依赖:** `UTIL-002` (验证器)
- **并行组:** Group-2
- **交付物:** `src/hooks/useCharacterCount.ts`
- **功能:**
  - 300ms防抖
  - 返回字符数和验证状态

### Task 2.4: 自定义Hook-剪贴板
- **任务ID:** `HOOK-004`
- **描述:** 封装复制到剪贴板功能
- **依赖:** 无
- **并行组:** Group-2
- **交付物:** `src/hooks/useClipboard.ts`
- **返回值:** `{ copyToClipboard, isCopied }`

### Task 2.5: 性能优化工具-流式缓冲器
- **任务ID:** `PERF-001`
- **描述:** 实现流式文本的缓冲优化类
- **依赖:** `STORE-001`, `UTIL-001`
- **并行组:** Group-2
- **交付物:** `src/utils/StreamBuffer.ts`
- **核心类:** `StreamBuffer`
- **功能:**
  - 缓冲区管理
  - 定时flush（50ms）

---

## Layer 3: 组件层 (Component Layer)

**特点：** 依赖Layer 2的Hooks和样式，7个任务可以并行执行

### Task 3.1: 通用组件-按钮
- **任务ID:** `COMP-COMMON-001`
- **描述:** 实现可复用按钮组件
- **依赖:** `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/common/Button/Button.tsx`
  - `src/components/common/Button/Button.module.css`
  - `src/components/common/Button/index.ts`
- **Props:**
  - `variant`: 'primary' | 'secondary' | 'danger'
  - `size`: 'sm' | 'md' | 'lg'
  - `loading`: boolean
  - `disabled`: boolean

### Task 3.2: 通用组件-文本框
- **任务ID:** `COMP-COMMON-002`
- **描述:** 实现多行文本输入框
- **依赖:** `HOOK-003` (字符计数), `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/common/TextArea/TextArea.tsx`
  - `src/components/common/TextArea/index.ts`
- **功能:**
  - 自动高度调整
  - 字符计数显示
  - 验证提示

### Task 3.3: 通用组件-角色选择器
- **任务ID:** `COMP-COMMON-003`
- **描述:** 实现PM/Dev角色切换组件
- **依赖:** `STORE-001`, `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/common/RoleSelector/RoleSelector.tsx`
  - `src/components/common/RoleSelector/index.ts`
- **功能:**
  - 角色切换按钮
  - 激活状态显示

### Task 3.4: 布局组件-头部
- **任务ID:** `COMP-LAYOUT-001`
- **描述:** 实现页面头部导航
- **依赖:** `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/layout/Header/Header.tsx`
  - `src/components/layout/Header/index.ts`
- **内容:**
  - Logo
  - 应用标题
  - WebSocket连接状态指示器

### Task 3.5: 布局组件-底部
- **任务ID:** `COMP-LAYOUT-002`
- **描述:** 实现页面底部信息
- **依赖:** `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/layout/Footer/Footer.tsx`
  - `src/components/layout/Footer/index.ts`
- **内容:**
  - 版权信息
  - 链接

### Task 3.6: 业务组件-流式文本渲染
- **任务ID:** `COMP-BUSINESS-001`
- **描述:** 实现Markdown流式渲染组件
- **依赖:** `HOOK-002` (流式文本), `STYLE-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/translation/StreamingText/StreamingText.tsx`
  - `src/components/translation/StreamingText/index.ts`
- **功能:**
  - Markdown渲染（react-markdown + remark-gfm）
  - 打字机光标动画（framer-motion）
  - React.memo性能优化

### Task 3.7: 业务组件-输入面板
- **任务ID:** `COMP-BUSINESS-002`
- **描述:** 实现输入区域组件
- **依赖:** `COMP-COMMON-002` (TextArea), `COMP-COMMON-003` (RoleSelector), `COMP-COMMON-001` (Button), `STORE-001`, `HOOK-001`
- **并行组:** Group-3
- **交付物:**
  - `src/components/translation/InputPanel/InputPanel.tsx`
  - `src/components/translation/InputPanel/index.ts`
- **功能:**
  - 角色选择
  - 文本输入
  - 提交按钮
  - 字符计数和验证提示

---

## Layer 4: 应用层 (Application Layer)

**特点：** 依赖Layer 3的所有组件，必须串行执行

### Task 4.1: 业务组件-结果面板
- **任务ID:** `COMP-BUSINESS-003`
- **描述:** 实现翻译结果展示区域
- **依赖:** `COMP-BUSINESS-001` (StreamingText), `COMP-COMMON-001` (Button), `HOOK-004` (剪贴板), `STORE-001`
- **并行组:** 独立（必须等待所有业务组件）
- **交付物:**
  - `src/components/translation/ResultPanel/ResultPanel.tsx`
  - `src/components/translation/ResultPanel/index.ts`
- **功能:**
  - 流式文本显示
  - 复制按钮
  - 清空按钮
  - Loading状态

### Task 4.2: 根组件-App
- **任务ID:** `APP-001`
- **描述:** 组装应用主组件
- **依赖:** `COMP-BUSINESS-003`, `COMP-LAYOUT-001`, `COMP-LAYOUT-002`, `HOOK-001`
- **并行组:** 独立（必须等待Task 4.1）
- **交付物:** `src/App.tsx`
- **功能:**
  - 布局组装
  - WebSocket连接初始化
  - 错误边界

### Task 4.3: 入口文件
- **任务ID:** `APP-002`
- **描述:** 创建应用入口文件
- **依赖:** `APP-001`
- **并行组:** 独立（必须等待Task 4.2）
- **交付物:** `src/main.tsx`
- **功能:**
  - React渲染
  - 全局样式导入
  - 性能监控初始化

---

## Layer 5: 质量保障层 (Quality Assurance Layer)

**特点：** 依赖完整应用，3个任务可以并行执行

### Task 5.1: 单元测试
- **任务ID:** `TEST-001`
- **描述:** 编写单元测试
- **依赖:** Layer 4 所有任务
- **并行组:** Group-5
- **交付物:**
  - `src/hooks/__tests__/useWebSocket.test.ts`
  - `src/hooks/__tests__/useCharacterCount.test.ts`
  - `src/utils/__tests__/validation.test.ts`
  - `src/store/__tests__/translationStore.test.ts`
- **覆盖率目标:** > 80%

### Task 5.2: 组件测试
- **任务ID:** `TEST-002`
- **描述:** 编写组件测试
- **依赖:** Layer 4 所有任务
- **并行组:** Group-5
- **交付物:**
  - `src/components/common/__tests__/Button.test.tsx`
  - `src/components/common/__tests__/TextArea.test.tsx`
  - `src/components/translation/__tests__/StreamingText.test.tsx`
- **工具:** @testing-library/react

### Task 5.3: E2E测试
- **任务ID:** `TEST-003`
- **描述:** 编写端到端测试
- **依赖:** Layer 4 所有任务
- **并行组:** Group-5
- **交付物:** `e2e/translation.spec.ts`
- **测试场景:**
  - 完整翻译流程
  - WebSocket重连
  - 错误处理
- **工具:** Playwright

---

## 依赖关系矩阵

| 任务 | 直接依赖 | 可并行任务组 |
|------|----------|--------------|
| INIT-001 ~ STYLE-001 | 无 | Group-0 (8个任务) |
| SERVICE-001 | TYPE-001, UTIL-001 | Group-1 |
| STORE-001 | TYPE-001 | Group-1 |
| STORE-002 | 无 | Group-1 |
| HOOK-001 ~ PERF-001 | Layer 1 | Group-2 (5个任务) |
| COMP-COMMON-001 ~ COMP-BUSINESS-002 | Layer 2 | Group-3 (7个任务) |
| COMP-BUSINESS-003 | COMP-BUSINESS-001, COMP-COMMON-001, HOOK-004 | 独立 |
| APP-001 | COMP-BUSINESS-003, COMP-LAYOUT-* | 独立 |
| APP-002 | APP-001 | 独立 |
| TEST-001 ~ TEST-003 | Layer 4 | Group-5 (3个任务) |

---

## 执行策略

### 并行度最大化原则
1. 同一Group内的任务可以同时开始执行
2. Group-0 有8个并行任务（最高并行度）
3. Group-2 有5个并行任务
4. Group-3 有7个并行任务

### 依赖检查点
- **Checkpoint 1:** Layer 0 全部完成 → 启动 Layer 1
- **Checkpoint 2:** Layer 1 全部完成 → 启动 Layer 2
- **Checkpoint 3:** Layer 2 全部完成 → 启动 Layer 3
- **Checkpoint 4:** Layer 3 全部完成 → 启动 Task 4.1
- **Checkpoint 5:** Task 4.1 完成 → 启动 Task 4.2
- **Checkpoint 6:** Task 4.2 完成 → 启动 Task 4.3
- **Checkpoint 7:** Layer 4 全部完成 → 启动 Layer 5

### 错误恢复策略
- 如果某个任务失败，仅阻塞依赖该任务的后续任务
- 同层级其他无关任务继续执行
- 修复后从失败点继续执行依赖链

---

## 关键路径分析 (Critical Path)

最长依赖链（关键路径）：
```
INIT-001 → TYPE-001 → SERVICE-001 → HOOK-001 → COMP-BUSINESS-002
  → COMP-BUSINESS-003 → APP-001 → APP-002 → TEST-003
```

**关键路径长度:** 9个任务节点
**预估总并行批次:** 8个批次（Layer 0-5 + Task 4.1-4.3）

---

## 验证检查清单

每个Layer完成后需验证：

- [ ] **Layer 0**: 项目可以成功启动 `npm run dev`
- [ ] **Layer 1**: WebSocket可以连接，Store状态可以更新
- [ ] **Layer 2**: 所有Hooks可以正常调用和返回
- [ ] **Layer 3**: 所有组件可以独立渲染
- [ ] **Layer 4**: 应用可以完整运行，UI正常显示
- [ ] **Layer 5**: 所有测试通过，覆盖率达标

---

## 附录：任务时长预估（供参考）

| Layer | 并行任务数 | 预估时长 |
|-------|-----------|---------|
| Layer 0 | 8 | 1-2小时 |
| Layer 1 | 3 | 1小时 |
| Layer 2 | 5 | 1-2小时 |
| Layer 3 | 7 | 2-3小时 |
| Layer 4 | 3 (串行) | 1小时 |
| Layer 5 | 3 | 2-3小时 |

**注意:** 这些时长仅供参考，实际执行由AI自动完成，不作为硬性时间约束。

---

## 文档维护

- **版本:** V1.0.0
- **创建日期:** 2026-02-09
- **更新策略:** 每完成一个Layer后更新实际执行情况
- **执行日志:** 记录在 `execution-log.md` (自动生成)
