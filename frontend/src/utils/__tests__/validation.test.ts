import { describe, test, expect } from 'vitest';
import { validateInput, getCharacterCount, isValidRole } from '../validation';

describe('validateInput', () => {
  test('should validate correct input', () => {
    const result = validateInput('This is a valid input with enough characters');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should reject empty input', () => {
    const result = validateInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('请输入内容');
  });

  test('should reject whitespace-only input', () => {
    const result = validateInput('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('请输入内容');
  });

  test('should reject too short input', () => {
    const result = validateInput('短');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('至少需要');
  });

  test('should reject too long input', () => {
    const longText = 'a'.repeat(5001);
    const result = validateInput(longText);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('不能超过');
  });

  test('should detect XSS attempt with script tag', () => {
    const result = validateInput('<script>alert("xss")</script>');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('非法字符');
  });

  test('should detect XSS attempt with javascript:', () => {
    const result = validateInput('javascript:alert("xss")');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('非法字符');
  });

  test('should detect XSS attempt with onerror', () => {
    const result = validateInput('<img onerror="alert(1)" />');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('非法字符');
  });

  test('should accept valid content with special characters', () => {
    const result = validateInput('这是一个包含特殊字符的测试：!@#$%^&*()');
    expect(result.valid).toBe(true);
  });
});

describe('getCharacterCount', () => {
  test('should count characters correctly', () => {
    expect(getCharacterCount('测试内容')).toBe(4);
    expect(getCharacterCount('Test Content')).toBe(12);
  });

  test('should trim whitespace before counting', () => {
    expect(getCharacterCount('  测试  ')).toBe(2);
    expect(getCharacterCount('  Test  ')).toBe(4);
  });

  test('should return 0 for empty string', () => {
    expect(getCharacterCount('')).toBe(0);
    expect(getCharacterCount('   ')).toBe(0);
  });
});

describe('isValidRole', () => {
  test('should accept valid pm role', () => {
    expect(isValidRole('pm')).toBe(true);
  });

  test('should accept valid dev role', () => {
    expect(isValidRole('dev')).toBe(true);
  });

  test('should reject invalid roles', () => {
    expect(isValidRole('admin')).toBe(false);
    expect(isValidRole('user')).toBe(false);
    expect(isValidRole('')).toBe(false);
  });

  test('should reject null', () => {
    expect(isValidRole(null)).toBe(false);
  });
});
