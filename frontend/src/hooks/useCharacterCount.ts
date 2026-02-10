import { useState, useEffect, useMemo } from 'react';
import { getCharacterCount, validateInput } from '@/utils/validation';
import type { ValidationResult } from '@/utils/validation';

const DEBOUNCE_DELAY = 300;

/**
 * useCharacterCount Hook
 * 实时统计输入字符数并进行验证 (带300ms防抖)
 */
export const useCharacterCount = (text: string) => {
  const [debouncedText, setDebouncedText] = useState(text);

  // Debounce text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  // Calculate character count
  const count = useMemo(() => {
    return getCharacterCount(debouncedText);
  }, [debouncedText]);

  // Validate input
  const validation: ValidationResult = useMemo(() => {
    return validateInput(debouncedText);
  }, [debouncedText]);

  return {
    count,
    isValid: validation.valid,
    error: validation.error
  };
};
