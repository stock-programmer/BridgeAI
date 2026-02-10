import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const translateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: '请求过于频繁,请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: '请求过于频繁,请稍后再试'
    });
  }
});
