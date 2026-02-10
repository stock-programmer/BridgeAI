# 后端开发任务 1.2: 创建 package.json

## 任务信息
- **任务ID**: `L0-T2`
- **任务层级**: Layer 0 (第一层 - 基础设施层)
- **依赖关系**: 无依赖 (可立即开始)
- **并行组**: Group-1 (可与 1.1, 1.3, 1.4 并行执行)
- **预估工时**: 10-15分钟

## 任务目标
创建项目的 package.json 配置文件,定义项目依赖、脚本命令和元信息。

## 产出物
- **文件路径**: `backend/package.json`
- **文件类型**: JSON配置文件

## 核心配置要求

### 1. 基础信息
```json
{
  "name": "bridgeai-backend",
  "version": "1.0.0",
  "type": "module",
  "description": "产研职能沟通翻译助手后端服务",
  "main": "src/server.js"
}
```

**关键点**:
- ⚠️ `"type": "module"` 必须设置,启用 ES6 模块支持

### 2. 脚本命令
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js"
  }
}
```

### 3. 生产依赖 (dependencies)
| 依赖包 | 版本 | 用途 |
|--------|------|------|
| `express` | ^4.18.2 | Web框架 |
| `axios` | ^1.6.0 | HTTP客户端(调用Qwen API) |
| `dotenv` | ^16.3.1 | 环境变量管理 |
| `cors` | ^2.8.5 | 跨域支持 |
| `helmet` | ^7.1.0 | 安全响应头 |
| `compression` | ^1.7.4 | Gzip压缩 |
| `winston` | ^3.11.0 | 日志管理 |
| `express-rate-limit` | ^7.1.5 | API限流 |
| `validator` | ^13.11.0 | 输入校验 |

### 4. 开发依赖 (devDependencies)
| 依赖包 | 版本 | 用途 |
|--------|------|------|
| `nodemon` | ^3.0.2 | 开发热重载 |
| `jest` | ^29.7.0 | 测试框架 |
| `supertest` | ^6.3.3 | HTTP集成测试 |
| `eslint` | ^8.55.0 | 代码规范检查 |

## 完整文件内容

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
  "keywords": ["ai", "translation", "bridge", "pm", "dev"],
  "author": "BridgeAI Team",
  "license": "MIT",
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
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 执行步骤

### 1. 进入后端目录
```bash
cd backend/
```

### 2. 创建 package.json 文件
```bash
cat > package.json << 'EOF'
[粘贴上面的完整JSON内容]
EOF
```

或者使用文本编辑器手动创建。

### 3. 安装依赖 (可选 - 验证配置)
```bash
npm install
```

### 4. 验证安装
```bash
npm list --depth=0
```

## 验证标准
- [ ] package.json 文件存在于 backend/ 目录
- [ ] JSON 格式正确 (可用 `npm pkg get` 验证)
- [ ] `"type": "module"` 已配置
- [ ] 所有9个生产依赖包已列出
- [ ] 所有4个开发依赖包已列出
- [ ] scripts 中包含 dev、start、test、lint 命令
- [ ] `npm install` 命令能成功执行

## 注意事项

### ⚠️ 关键配置
1. **必须设置** `"type": "module"`,否则无法使用 `import/export` 语法
2. **Node版本要求**: >= 18.0.0 (支持原生 fetch API)
3. **依赖版本**: 使用 `^` 允许小版本自动更新

### 📦 依赖安装说明
- 如果网络较慢,可使用国内镜像: `npm install --registry=https://registry.npmmirror.com`
- 建议安装后提交 `package-lock.json` 到版本控制

## 后续任务依赖
该任务是关键基础任务,以下任务直接依赖它:
- `L1-T1` (实现配置管理模块) - 需要 dotenv 包
- `L1-T2` (实现日志工具) - 需要 winston 包
- `L2-T3` (实现请求校验中间件) - 需要 validator 包
- `L2-T4` (实现限流中间件) - 需要 express-rate-limit 包

## 状态追踪
- [x] 任务规划完成
- [ ] 任务执行中
- [ ] 任务已完成
- [ ] 已验证

---
**创建时间**: 2026-02-09
**所属文档**: backend-development-plan.md
**DAG位置**: Layer 0 → 第2个并行任务
