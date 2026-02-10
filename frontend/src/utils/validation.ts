import { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateInput = (text: string): ValidationResult => {
  // 1. 长度检查
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      error: '请输入内容'
    };
  }

  const trimmedLength = text.trim().length;

  if (trimmedLength < MIN_INPUT_LENGTH) {
    return {
      valid: false,
      error: `内容至少需要 ${MIN_INPUT_LENGTH} 个字符`
    };
  }

  if (trimmedLength > MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: `内容不能超过 ${MAX_INPUT_LENGTH} 个字符`
    };
  }

  // 2. XSS 基础防护
  const dangerousPattern = /<script|javascript:|onerror=/i;
  if (dangerousPattern.test(text)) {
    return {
      valid: false,
      error: '检测到非法字符,请检查输入内容'
    };
  }

  return { valid: true };
};

export const getCharacterCount = (text: string): number => {
  return text.trim().length;
};

export const isValidRole = (role: string | null): role is 'pm' | 'dev' => {
  return role === 'pm' || role === 'dev';
};
