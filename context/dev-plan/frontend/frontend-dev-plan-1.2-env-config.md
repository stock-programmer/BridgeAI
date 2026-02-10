# 前端开发任务 1.2: 环境变量配置

## 任务信息
- **任务ID**: `ENV-001`
- **依赖**: 无
- **并行组**: Group-0
- **预估工时**: 5分钟

## 产出物
- `.env.development`
- `.env.production`

## 完整内容

### .env.development
```bash
# 开发环境配置
VITE_WS_URL=ws://localhost:3000
VITE_API_URL=http://localhost:3000/api
```

### .env.production
```bash
# 生产环境配置
VITE_WS_URL=wss://api.bridgeai.com
VITE_API_URL=https://api.bridgeai.com/api
```

## 使用方式
```typescript
// 在代码中访问
const wsUrl = import.meta.env.VITE_WS_URL;
const apiUrl = import.meta.env.VITE_API_URL;
```

## 验证
- [ ] 环境变量可以在代码中访问
- [ ] 开发和生产环境配置不同

---
**创建时间**: 2026-02-09
