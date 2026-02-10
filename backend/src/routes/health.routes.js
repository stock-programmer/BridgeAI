import express from 'express';
import config from '../config/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    qwen: {
      configured: !!config.qwen.apiKey,
      model: config.qwen.model
    }
  });
});

export default router;
