# 后端开发任务 6.3: 实现路由聚合

## 任务信息
- **任务ID**: `L5-T3`
- **依赖**: `L5-T1`, `L5-T2`
- **并行组**: 独立（依赖其他 Layer 5 任务）
- **预估工时**: 5分钟

## 任务目标
聚合所有路由模块。

## 产出物
`backend/src/routes/index.js`

## 完整代码
```javascript
import express from 'express';
import translateRoutes from './translate.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

// 挂载翻译路由
router.use('/translate', translateRoutes);

// 挂载健康检查路由
router.use('/health', healthRoutes);

export default router;
```

## 路由结构
```
/api
  /translate
    POST /stream  -> 流式翻译
    POST /        -> 常规翻译
  /health
    GET /         -> 健康检查
```

## 验证标准
- [ ] 所有路由正确挂载
- [ ] 路由路径符合 RESTful 规范

---
**创建时间**: 2026-02-09
