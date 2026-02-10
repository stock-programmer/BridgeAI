/**
 * Validator 中间件单元测试
 * 测试请求验证功能
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { validateTranslateRequest } from '../../src/middleware/validator.js';
import { ROLE, HTTP_STATUS, ERROR_MESSAGES, VALIDATION } from '../../src/utils/constants.js';

describe('Validator Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // 创建模拟的 req, res, next
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('validateTranslateRequest() - role validation', () => {
    test('should accept valid PM role', () => {
      req.body = {
        role: 'pm',
        content: '这是一个测试内容，用于验证产品经理角色'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should accept valid Dev role', () => {
      req.body = {
        role: 'dev',
        content: '这是一个测试内容，用于验证开发工程师角色'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject missing role', () => {
      req.body = {
        content: '测试内容但缺少角色'
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.INVALID_ROLE
      });
    });

    test('should reject invalid role', () => {
      req.body = {
        role: 'admin',
        content: '测试内容但角色无效'
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.INVALID_ROLE
      });
    });

    test('should reject uppercase role', () => {
      req.body = {
        role: 'PM',
        content: '测试内容但角色大小写错误'
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    test('should reject empty role string', () => {
      req.body = {
        role: '',
        content: '测试内容但角色为空字符串'
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });

  describe('validateTranslateRequest() - content validation', () => {
    test('should accept valid content', () => {
      req.body = {
        role: 'pm',
        content: '这是一个有效的测试内容'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject missing content', () => {
      req.body = {
        role: 'pm'
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.CONTENT_REQUIRED
      });
    });

    test('should reject empty content', () => {
      req.body = {
        role: 'dev',
        content: ''
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    test('should reject non-string content', () => {
      req.body = {
        role: 'pm',
        content: 12345
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.CONTENT_REQUIRED
      });
    });

    test('should reject content with only whitespace', () => {
      req.body = {
        role: 'dev',
        content: '   '
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.CONTENT_TOO_SHORT
      });
    });
  });

  describe('validateTranslateRequest() - content length validation', () => {
    test('should reject content shorter than minimum length', () => {
      req.body = {
        role: 'pm',
        content: '短文本'  // 3 个字符，小于 MIN_CONTENT_LENGTH (10)
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.CONTENT_TOO_SHORT
      });
    });

    test('should accept content at minimum length boundary', () => {
      req.body = {
        role: 'pm',
        content: '这是最小长度内容测试'  // 正好 10 个字符
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject content longer than maximum length', () => {
      req.body = {
        role: 'dev',
        content: 'A'.repeat(VALIDATION.MAX_CONTENT_LENGTH + 1)
      };

      validateTranslateRequest(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.CONTENT_TOO_LONG
      });
    });

    test('should accept content at maximum length boundary', () => {
      req.body = {
        role: 'pm',
        content: 'A'.repeat(VALIDATION.MAX_CONTENT_LENGTH)
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should trim whitespace before checking length', () => {
      req.body = {
        role: 'dev',
        content: '   这是带有空格的内容测试   '
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      // 验证内容已被修剪
      expect(req.body.content).not.toMatch(/^\s+/);
      expect(req.body.content).not.toMatch(/\s+$/);
    });
  });

  describe('validateTranslateRequest() - XSS protection', () => {
    test('should escape HTML tags', () => {
      req.body = {
        role: 'pm',
        content: '<script>alert("XSS")</script>这是测试内容'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.content).not.toContain('<script>');
      expect(req.body.content).toContain('&lt;');
      expect(req.body.content).toContain('&gt;');
    });

    test('should escape special characters', () => {
      req.body = {
        role: 'dev',
        content: '测试内容 & "引号" <标签> \'单引号\''
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.content).toContain('&amp;');
      expect(req.body.content).toContain('&quot;');
      expect(req.body.content).toContain('&lt;');
      expect(req.body.content).toContain('&gt;');
    });

    test('should preserve safe content', () => {
      req.body = {
        role: 'pm',
        content: '这是一个安全的测试内容，没有特殊字符'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.content).toContain('这是一个安全的测试内容');
    });
  });

  describe('validateTranslateRequest() - edge cases', () => {
    test('should handle Unicode characters', () => {
      req.body = {
        role: 'pm',
        content: '测试 Unicode: 你好世界 🚀 emoji'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should handle multi-line content', () => {
      req.body = {
        role: 'dev',
        content: '第一行内容\n第二行内容\n第三行内容'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should handle content with tabs and special whitespace', () => {
      req.body = {
        role: 'pm',
        content: '\t\t有制表符的内容测试这是一个足够长的测试内容\t\t'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateTranslateRequest() - integration', () => {
    test('should pass all validations with perfect input', () => {
      req.body = {
        role: ROLE.PM,
        content: '我们需要开发一个用户推荐功能，提升用户活跃度'
      };

      validateTranslateRequest(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should stop at first validation error', () => {
      req.body = {
        role: 'invalid',
        content: ''
      };

      validateTranslateRequest(req, res, next);

      // 应该在角色验证失败后停止，不会继续检查内容
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: ERROR_MESSAGES.INVALID_ROLE
      });
    });
  });
});
