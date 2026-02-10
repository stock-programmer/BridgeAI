# 后端开发任务 1.4: 创建 .env.example

## 任务信息
- **任务ID**: `L0-T4`
- **任务层级**: Layer 0 (第一层 - 基础设施层)
- **依赖关系**: 无依赖 (可立即开始)
- **并行组**: Group-1 (可与 1.1, 1.2, 1.3 并行执行)
- **预估工时**: 10分钟

## 任务目标
创建环境变量模板文件 `.env.example`,为开发者提供配置参考,确保所有必需的环境变量都有文档说明。

## 产出物
- **文件路径**: `backend/.env.example`
- **文件类型**: 环境变量模板文件

## 环境变量分类

### 1. 服务配置
| 变量名 | 说明 | 示例值 | 必填 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `development` / `production` | ✅ |
| `PORT` | 服务监听端口 | `3000` | ✅ |
| `CORS_ORIGIN` | 允许的跨域来源 | `http://localhost:5173` | ✅ |

### 2. Qwen API 配置
| 变量名 | 说明 | 示例值 | 必填 |
|--------|------|--------|------|
| `QWEN_API_KEY` | 通义千问 API 密钥 | `sk-xxxxxxxxxxxxxx` | ✅ |
| `QWEN_MODEL` | 使用的模型名称 | `qwen-plus` | ❌ |
| `QWEN_TEMPERATURE` | 温度参数 (创造性) | `0.7` | ❌ |
| `QWEN_MAX_TOKENS` | 最大生成 Token 数 | `2000` | ❌ |
| `QWEN_TIMEOUT` | API 请求超时时间 (毫秒) | `30000` | ❌ |

### 3. 日志配置
| 变量名 | 说明 | 示例值 | 必填 |
|--------|------|--------|------|
| `LOG_LEVEL` | 日志级别 | `info` / `debug` / `error` | ❌ |

## 完整文件内容

```bash
# ==========================================
# BridgeAI Backend - 环境变量配置模板
# ==========================================
#
# 使用说明:
# 1. 复制本文件为 .env: cp .env.example .env
# 2. 填写实际的配置值 (特别是 QWEN_API_KEY)
# 3. 切勿将 .env 文件提交到 Git 仓库
#
# ==========================================

# ------------------------------------------
# 服务配置
# ------------------------------------------

# 运行环境: development | production | test
NODE_ENV=development

# 服务监听端口
PORT=3000

# 允许的跨域来源 (前端地址)
# 开发环境: http://localhost:5173
# 生产环境: https://yourdomain.com
CORS_ORIGIN=http://localhost:5173

# ------------------------------------------
# Qwen API 配置 (通义千问大模型)
# ------------------------------------------

# API Key (必填)
# 获取地址: https://dashscope.console.aliyun.com/apiKey
QWEN_API_KEY=sk-your-api-key-here

# 模型选择 (可选,默认: qwen-plus)
# 可选值: qwen-turbo | qwen-plus | qwen-max
QWEN_MODEL=qwen-plus

# Temperature 参数 (可选,默认: 0.7)
# 范围: 0.0-2.0, 越高越有创造性
QWEN_TEMPERATURE=0.7

# 最大生成 Token 数 (可选,默认: 2000)
QWEN_MAX_TOKENS=2000

# API 请求超时时间 (可选,默认: 30000 毫秒)
QWEN_TIMEOUT=30000

# ------------------------------------------
# 日志配置
# ------------------------------------------

# 日志级别 (可选,默认: info)
# 可选值: error | warn | info | debug
LOG_LEVEL=info

# ------------------------------------------
# 高级配置 (可选)
# ------------------------------------------

# API 限流配置 (15分钟内最大请求次数)
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=100
```

## 执行步骤

### 1. 进入后端目录
```bash
cd backend/
```

### 2. 创建 .env.example 文件
```bash
cat > .env.example << 'EOF'
[粘贴上面的完整内容]
EOF
```

### 3. 提示用户创建实际的 .env 文件
```bash
# 复制模板为实际配置文件
cp .env.example .env

# 提醒用户编辑 .env 文件,填入真实的 API Key
echo "请编辑 .env 文件,填入您的 QWEN_API_KEY"
```

### 4. 验证文件
```bash
cat .env.example
```

## 验证标准
- [ ] .env.example 文件存在于 backend/ 目录
- [ ] 文件包含所有关键环境变量
- [ ] 每个变量都有注释说明
- [ ] `QWEN_API_KEY` 的值是占位符 (sk-your-api-key-here)
- [ ] 文件包含使用说明
- [ ] 使用说明中提醒不要提交 .env 到 Git

## 开发者使用流程

### 首次配置
```bash
# 1. 克隆项目后,复制模板
cp .env.example .env

# 2. 编辑 .env 文件
nano .env  # 或使用其他编辑器

# 3. 填入真实的 API Key (从阿里云获取)
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx

# 4. 验证配置是否生效
npm run dev
```

### 获取 Qwen API Key
1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/apiKey)
2. 登录阿里云账号
3. 创建 API Key
4. 复制密钥到 .env 文件

## 安全最佳实践

### ✅ 应该做的
1. **提交 .env.example 到 Git**: 作为团队配置文档
2. **保持模板同步**: 每次新增环境变量,同步更新 .env.example
3. **使用占位符**: 示例值使用 `your-xxx-here` 格式
4. **详细注释**: 每个变量都应有说明和示例

### ❌ 不应该做的
1. **禁止提交 .env**: 包含真实密钥的文件
2. **禁止在 .env.example 中使用真实密钥**
3. **禁止在代码中硬编码密钥**

## 环境变量优先级

Node.js 加载环境变量的优先级:
```
1. 命令行参数 (如: NODE_ENV=production npm start)
2. .env 文件
3. 系统环境变量
4. 代码中的默认值
```

## 后续任务依赖
该任务完成后,以下任务可以开始:
- `L1-T1` (实现配置管理模块) - 将读取这些环境变量
- 所有依赖配置的模块都需要参考本文件

## 常见问题

### Q1: .env 和 .env.example 有什么区别?
- **`.env`**: 包含真实密钥,被 .gitignore 忽略,不提交
- **`.env.example`**: 模板文件,提交到 Git,团队共享

### Q2: 如何在不同环境使用不同配置?
```bash
# 开发环境
cp .env.example .env.development

# 生产环境
cp .env.example .env.production

# 运行时指定
NODE_ENV=production node src/server.js
```

### Q3: 如何验证环境变量是否生效?
在代码中添加调试输出:
```javascript
console.log('PORT:', process.env.PORT);
console.log('QWEN_API_KEY exists:', !!process.env.QWEN_API_KEY);
```

## 状态追踪
- [x] 任务规划完成
- [ ] 任务执行中
- [ ] 任务已完成
- [ ] 已验证

---
**创建时间**: 2026-02-09
**所属文档**: backend-development-plan.md
**DAG位置**: Layer 0 → 第4个并行任务
