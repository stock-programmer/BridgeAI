# 后端开发任务 6.1: 实现翻译路由

## 任务信息
- **任务ID**: `L5-T1`
- **依赖**: `L4-T1` (controller), `L2-T3` (validator)
- **并行组**: Group-6
- **预估工时**: 10分钟

## 任务目标
定义翻译相关的路由规则。

## 产出物
`backend/src/routes/translate.routes.js`

## 完整代码
```javascript
import express from 'express';
import * as translateController from '../controllers/translate.controller.js';
import { validateTranslateRequest } from '../middleware/validator.js';

const router = express.Router();

// POST /stream - 流式翻译接口 (SSE)
router.post('/stream',
  validateTranslateRequest,
  translateController.translateStream
);

// POST / - 常规翻译接口 (JSON)
router.post('/',
  validateTranslateRequest,
  translateController.translate
);

export default router;
```

## 验证标准
- [ ] 路由正确挂载
- [ ] 中间件执行顺序正确
- [ ] 路由可以正常访问

---
**创建时间**: 2026-02-09
