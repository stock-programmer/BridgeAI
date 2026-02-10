import express from 'express';
import translateRoutes from './translate.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

// 挂载翻译路由
router.use('/translate', translateRoutes);

// 挂载健康检查路由
router.use('/health', healthRoutes);

export default router;
