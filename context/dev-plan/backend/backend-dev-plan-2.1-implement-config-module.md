# 后端开发任务 2.1: 实现配置管理模块

## 任务信息
- **任务ID**: `L1-T1`
- **任务层级**: Layer 1 (第二层 - 配置与工具基础)
- **依赖关系**: 依赖 `L0-T2` (package.json 中需包含 dotenv)
- **并行组**: Group-2 (可与 2.2, 2.3 并行执行)
- **预估工时**: 15-20分钟

## 任务目标
创建统一的配置管理模块,封装所有环境变量的读取和验证逻辑,提供类型安全的配置访问接口。

## 产出物
- **文件路径**: `backend/src/config/index.js`
- **文件类型**: ES6 Module

## 核心功能

### 1. 环境变量加载
- 使用 `dotenv` 包加载 `.env` 文件
- 支持开发/生产环境切换

### 2. 配置对象导出
导出三个主要配置对象:
- **server**: 服务器配置 (端口、环境、CORS)
- **qwen**: Qwen API 配置 (密钥、模型、参数)
- **rateLimit**: 限流配置

### 3. 配置验证
- 检查必需环境变量是否存在
- 提供合理的默认值

## 完整实现代码

```javascript
// backend/src/config/index.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录路径 (ES Module 方式)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({
  path: join(__dirname, '../../.env')
});

/**
 * 配置管理中心
 * 统一管理所有环境变量和配置项
 */
const config = {
  // ------------------------------------------
  // 服务器配置
  // ------------------------------------------
  server: {
    // 运行环境
    env: process.env.NODE_ENV || 'development',

    // 监听端口
    port: parseInt(process.env.PORT, 10) || 3000,

    // 允许的跨域来源
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // 是否为生产环境
    isProduction: process.env.NODE_ENV === 'production',

    // 是否为开发环境
    isDevelopment: process.env.NODE_ENV === 'development'
  },

  // ------------------------------------------
  // Qwen 大模型配置
  // ------------------------------------------
  qwen: {
    // API 密钥 (必填)
    apiKey: process.env.QWEN_API_KEY,

    // API 基础地址
    apiBase: 'https://dashscope.aliyuncs.com/api/v1',

    // 使用的模型
    model: process.env.QWEN_MODEL || 'qwen-plus',

    // 温度参数 (控制创造性)
    temperature: parseFloat(process.env.QWEN_TEMPERATURE) || 0.7,

    // 最大生成 Token 数
    maxTokens: parseInt(process.env.QWEN_MAX_TOKENS, 10) || 2000,

    // 请求超时时间 (毫秒)
    timeout: parseInt(process.env.QWEN_TIMEOUT, 10) || 30000,

    // Top-P 采样参数
    topP: 0.8
  },

  // ------------------------------------------
  // 限流配置
  // ------------------------------------------
  rateLimit: {
    // 时间窗口 (毫秒)
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15分钟

    // 最大请求次数
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
  },

  // ------------------------------------------
  // 日志配置
  // ------------------------------------------
  logging: {
    // 日志级别
    level: process.env.LOG_LEVEL || 'info',

    // 是否启用控制台输出
    enableConsole: process.env.NODE_ENV !== 'production'
  }
};

/**
 * 验证必需的配置项
 * 在应用启动前检查关键配置是否存在
 */
export function validateConfig() {
  const errors = [];

  // 检查 Qwen API Key
  if (!config.qwen.apiKey) {
    errors.push('QWEN_API_KEY 环境变量未设置');
  }

  // 检查 API Key 格式 (应以 sk- 开头)
  if (config.qwen.apiKey && !config.qwen.apiKey.startsWith('sk-')) {
    errors.push('QWEN_API_KEY 格式不正确,应以 "sk-" 开头');
  }

  // 检查端口号范围
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push(`PORT 端口号无效: ${config.server.port}`);
  }

  // 检查温度参数范围
  if (config.qwen.temperature < 0 || config.qwen.temperature > 2) {
    errors.push(`QWEN_TEMPERATURE 参数超出范围 [0, 2]: ${config.qwen.temperature}`);
  }

  // 如果有错误,抛出异常
  if (errors.length > 0) {
    throw new Error(
      `配置验证失败:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`
    );
  }

  return true;
}

/**
 * 打印当前配置 (脱敏)
 * 用于调试和日志记录
 */
export function printConfig() {
  return {
    server: {
      env: config.server.env,
      port: config.server.port,
      corsOrigin: config.server.corsOrigin
    },
    qwen: {
      apiKey: config.qwen.apiKey ? `${config.qwen.apiKey.substring(0, 8)}...` : 'NOT_SET',
      model: config.qwen.model,
      temperature: config.qwen.temperature,
      maxTokens: config.qwen.maxTokens
    },
    rateLimit: config.rateLimit,
    logging: config.logging
  };
}

// 默认导出配置对象
export default config;
```

## 执行步骤

### 1. 确认前置任务完成
```bash
# 检查 package.json 中是否包含 dotenv
grep "dotenv" backend/package.json
```

### 2. 创建配置文件
```bash
# 进入 config 目录
cd backend/src/config/

# 创建 index.js 文件 (粘贴上面的完整代码)
```

### 3. 创建测试文件 (可选)
```javascript
// backend/test-config.js
import config, { validateConfig, printConfig } from './src/config/index.js';

console.log('=== 配置验证 ===');
try {
  validateConfig();
  console.log('✅ 配置验证通过\n');
} catch (error) {
  console.error('❌ 配置验证失败:', error.message);
  process.exit(1);
}

console.log('=== 当前配置 ===');
console.log(JSON.stringify(printConfig(), null, 2));
```

### 4. 测试配置模块
```bash
# 运行测试
node backend/test-config.js
```

## 验证标准
- [ ] `src/config/index.js` 文件存在
- [ ] 文件可以被成功导入
- [ ] `validateConfig()` 函数正常工作
- [ ] 当 `.env` 中缺少 `QWEN_API_KEY` 时,`validateConfig()` 抛出错误
- [ ] `printConfig()` 能正确脱敏 API Key (只显示前8位)
- [ ] 配置对象包含 server、qwen、rateLimit 三个子对象
- [ ] 所有配置项都有合理的默认值

## 使用示例

### 在其他模块中使用配置

```javascript
// 示例1: 在服务器启动文件中使用
import config, { validateConfig } from './config/index.js';

// 启动前验证配置
validateConfig();

// 使用配置
const PORT = config.server.port;
const ENV = config.server.env;
```

```javascript
// 示例2: 在 LLM 服务中使用
import config from '../config/index.js';

const response = await axios.post(
  `${config.qwen.apiBase}/services/aigc/text-generation/generation`,
  requestBody,
  {
    headers: {
      'Authorization': `Bearer ${config.qwen.apiKey}`
    },
    timeout: config.qwen.timeout
  }
);
```

## 注意事项

### ⚠️ 安全提醒
1. **不要在日志中打印完整的 API Key**
   - 使用 `printConfig()` 自动脱敏
   - 只显示前8位字符

2. **验证环境变量格式**
   - API Key 必须以 `sk-` 开头
   - 数字类型要进行边界检查

3. **避免硬编码**
   - 所有可变配置都应通过环境变量管理
   - 不要在代码中直接写密钥

### 📝 最佳实践
1. **配置分层**
   - 按功能模块分组 (server/qwen/rateLimit)
   - 便于查找和维护

2. **类型转换**
   - 端口号: `parseInt(process.env.PORT, 10)`
   - 浮点数: `parseFloat(process.env.TEMPERATURE)`
   - 布尔值: `process.env.DEBUG === 'true'`

3. **默认值策略**
   - 必填项: 不提供默认值,验证时报错
   - 可选项: 提供合理的默认值

## 错误处理

### 常见错误1: QWEN_API_KEY 未设置
```
错误信息: 配置验证失败:
  1. QWEN_API_KEY 环境变量未设置

解决方案:
1. 检查 .env 文件是否存在
2. 确认 .env 中有 QWEN_API_KEY=sk-xxx
3. 重启应用使环境变量生效
```

### 常见错误2: dotenv 模块未找到
```
错误信息: Cannot find package 'dotenv'

解决方案:
npm install
```

## 后续任务依赖
该模块是整个后端的配置核心,以下任务直接依赖它:
- `L2-T4` (实现限流中间件) - 读取 config.rateLimit
- `L3-T1` (实现 LLM 服务) - 读取 config.qwen
- `L6-T2` (实现服务器启动) - 读取 config.server.port

## 扩展建议

### 未来可扩展的配置项
```javascript
// 数据库配置 (如果后续需要)
database: {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  name: process.env.DB_NAME || 'bridgeai'
},

// Redis 缓存配置 (如果后续需要)
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379
}
```

## 状态追踪
- [x] 任务规划完成
- [ ] 任务执行中
- [ ] 任务已完成
- [ ] 已验证

---
**创建时间**: 2026-02-09
**所属文档**: backend-development-plan.md
**DAG位置**: Layer 1 → 第1个并行任务
