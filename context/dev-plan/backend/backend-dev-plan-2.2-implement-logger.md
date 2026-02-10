# 后端开发任务 2.2: 实现日志工具

## 任务信息
- **任务ID**: `L1-T2`
- **依赖**: `L0-T2` (需要 winston 包)
- **并行组**: Group-2
- **预估工时**: 15分钟

## 任务目标
使用 Winston 实现统一的日志管理工具，支持多级别日志、文件输出和格式化。

## 产出物
`backend/src/utils/logger.js`

## 完整代码
```javascript
import winston from 'winston';
import config from '../config/index.js';

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

if (config.logging.enableConsole) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
      })
    )
  }));
}

export default logger;
```

## 验证
```bash
# 测试日志
node -e "import('./src/utils/logger.js').then(m => { m.default.info('测试日志'); m.default.error('测试错误'); })"
```

---
**创建时间**: 2026-02-09
