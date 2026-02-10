/**
 * System Prompt 模块单元测试
 * 测试系统提示词生成功能
 */

import { describe, test, expect } from '@jest/globals';
import {
  getSystemPrompt,
  buildUserPrompt,
  buildMessages,
  isValidRole
} from '../../src/prompts/system-prompt.js';

describe('System Prompt Module', () => {
  describe('getSystemPrompt()', () => {
    test('should return a non-empty string', () => {
      const prompt = getSystemPrompt();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    test('should contain role definition', () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain('产研协作职能翻译官');
      expect(prompt).toContain('Product-Tech Bridge Translator');
    });

    test('should contain key sections', () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain('# Role:');
      expect(prompt).toContain('## Profile');
      expect(prompt).toContain('## Core Competencies');
      expect(prompt).toContain('## Workflow');
      expect(prompt).toContain('## Constraints');
    });

    test('should contain PM to Dev translation guidance', () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain('产品经理视角');
      expect(prompt).toContain('致开发团队');
      expect(prompt).toContain('技术实现拆解');
    });

    test('should contain Dev to PM translation guidance', () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain('开发工程师视角');
      expect(prompt).toContain('致产品团队');
      expect(prompt).toContain('商业价值与体验影响');
    });

    test('should contain translation workflow steps', () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain('Step 1');
      expect(prompt).toContain('Step 2');
      expect(prompt).toContain('角色识别');
      expect(prompt).toContain('深度翻译');
    });

    test('should be consistent across multiple calls', () => {
      const prompt1 = getSystemPrompt();
      const prompt2 = getSystemPrompt();
      expect(prompt1).toBe(prompt2);
    });

    test('should have substantial content length', () => {
      const prompt = getSystemPrompt();
      // 系统提示词应该足够详细
      expect(prompt.length).toBeGreaterThan(1000);
    });
  });

  describe('buildUserPrompt()', () => {
    test('should build prompt for PM role', () => {
      const content = '我们需要一个用户推荐功能';
      const prompt = buildUserPrompt('pm', content);

      expect(prompt).toContain('产品经理');
      expect(prompt).toContain(content);
      expect(prompt).toContain('【当前角色】');
      expect(prompt).toContain('【输入内容】');
      expect(prompt).toContain('【任务】');
    });

    test('should build prompt for Dev role', () => {
      const content = '我们优化了数据库查询，QPS提升了30%';
      const prompt = buildUserPrompt('dev', content);

      expect(prompt).toContain('开发工程师');
      expect(prompt).toContain(content);
      expect(prompt).toContain('【当前角色】');
      expect(prompt).toContain('【输入内容】');
      expect(prompt).toContain('【任务】');
    });

    test('should include the user content verbatim', () => {
      const content = 'Test content with special chars: !@#$%';
      const prompt = buildUserPrompt('pm', content);

      expect(prompt).toContain(content);
    });

    test('should handle multi-line content', () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const prompt = buildUserPrompt('dev', content);

      expect(prompt).toContain('Line 1');
      expect(prompt).toContain('Line 2');
      expect(prompt).toContain('Line 3');
    });

    test('should handle empty content', () => {
      const prompt = buildUserPrompt('pm', '');

      expect(prompt).toContain('产品经理');
      expect(prompt).toContain('【当前角色】');
    });

    test('should handle long content', () => {
      const longContent = 'A'.repeat(1000);
      const prompt = buildUserPrompt('dev', longContent);

      expect(prompt).toContain(longContent);
      expect(prompt.length).toBeGreaterThan(1000);
    });
  });

  describe('buildMessages()', () => {
    test('should return an array with two messages', () => {
      const messages = buildMessages('pm', '测试内容');

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(2);
    });

    test('should have system message as first element', () => {
      const messages = buildMessages('pm', '测试内容');

      expect(messages[0].role).toBe('system');
      expect(messages[0].content).toBeDefined();
      expect(messages[0].content.length).toBeGreaterThan(0);
    });

    test('should have user message as second element', () => {
      const messages = buildMessages('dev', '测试内容');

      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toBeDefined();
      expect(messages[1].content).toContain('测试内容');
    });

    test('should include system prompt in system message', () => {
      const messages = buildMessages('pm', '测试内容');
      const systemPrompt = getSystemPrompt();

      expect(messages[0].content).toBe(systemPrompt);
    });

    test('should include user prompt in user message', () => {
      const content = '用户输入内容';
      const messages = buildMessages('dev', content);
      const userPrompt = buildUserPrompt('dev', content);

      expect(messages[1].content).toBe(userPrompt);
    });

    test('should work with PM role', () => {
      const messages = buildMessages('pm', '产品需求');

      expect(messages[1].content).toContain('产品经理');
      expect(messages[1].content).toContain('产品需求');
    });

    test('should work with Dev role', () => {
      const messages = buildMessages('dev', '技术方案');

      expect(messages[1].content).toContain('开发工程师');
      expect(messages[1].content).toContain('技术方案');
    });

    test('should produce valid message structure for API', () => {
      const messages = buildMessages('pm', '测试');

      // 验证消息结构符合 API 要求
      messages.forEach(msg => {
        expect(msg).toHaveProperty('role');
        expect(msg).toHaveProperty('content');
        expect(typeof msg.role).toBe('string');
        expect(typeof msg.content).toBe('string');
      });
    });
  });

  describe('isValidRole()', () => {
    test('should return true for "pm"', () => {
      expect(isValidRole('pm')).toBe(true);
    });

    test('should return true for "dev"', () => {
      expect(isValidRole('dev')).toBe(true);
    });

    test('should return false for invalid roles', () => {
      expect(isValidRole('PM')).toBe(false);
      expect(isValidRole('Dev')).toBe(false);
      expect(isValidRole('developer')).toBe(false);
      expect(isValidRole('product')).toBe(false);
      expect(isValidRole('admin')).toBe(false);
      expect(isValidRole('')).toBe(false);
    });

    test('should return false for null and undefined', () => {
      expect(isValidRole(null)).toBe(false);
      expect(isValidRole(undefined)).toBe(false);
    });

    test('should return false for non-string types', () => {
      expect(isValidRole(123)).toBe(false);
      expect(isValidRole(true)).toBe(false);
      expect(isValidRole({})).toBe(false);
      expect(isValidRole([])).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('should create complete message flow for PM', () => {
      const role = 'pm';
      const content = '我们需要增加一个用户画像功能';

      // 验证角色
      expect(isValidRole(role)).toBe(true);

      // 构建消息
      const messages = buildMessages(role, content);

      // 验证结构完整性
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[0].content).toContain('产研协作职能翻译官');
      expect(messages[1].content).toContain('产品经理');
      expect(messages[1].content).toContain(content);
    });

    test('should create complete message flow for Dev', () => {
      const role = 'dev';
      const content = '我们实现了 Redis 缓存，QPS 提升 50%';

      // 验证角色
      expect(isValidRole(role)).toBe(true);

      // 构建消息
      const messages = buildMessages(role, content);

      // 验证结构完整性
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[0].content).toContain('产研协作职能翻译官');
      expect(messages[1].content).toContain('开发工程师');
      expect(messages[1].content).toContain(content);
    });
  });
});
