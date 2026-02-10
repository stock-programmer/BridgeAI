import validator from 'validator';
import { ROLE, HTTP_STATUS, ERROR_MESSAGES, VALIDATION } from '../utils/constants.js';

export function validateTranslateRequest(req, res, next) {
  const { role, content } = req.body;

  // 1. 校验角色
  if (!role || ![ROLE.PM, ROLE.DEV].includes(role)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_ROLE
    });
  }

  // 2. 校验内容
  if (!content || typeof content !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_REQUIRED
    });
  }

  // 3. 内容长度限制
  const trimmedContent = content.trim();
  if (trimmedContent.length < VALIDATION.MIN_CONTENT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_TOO_SHORT
    });
  }

  if (trimmedContent.length > VALIDATION.MAX_CONTENT_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.CONTENT_TOO_LONG
    });
  }

  // 4. XSS 防护
  req.body.content = validator.escape(trimmedContent);

  next();
}
