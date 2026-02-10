import { renderHook, waitFor } from '@testing-library/react';
import { useCharacterCount } from '../useCharacterCount';
import { describe, test, expect, vi } from 'vitest';

describe('useCharacterCount', () => {
  test('should return correct character count', async () => {
    const { result } = renderHook(() => useCharacterCount('测试内容'));

    // Wait for debounce
    await waitFor(() => {
      expect(result.current.count).toBe(4);
    }, { timeout: 500 });
  });

  test('should trim whitespace before counting', async () => {
    const { result } = renderHook(() => useCharacterCount('  测试  '));

    await waitFor(() => {
      expect(result.current.count).toBe(2);
    }, { timeout: 500 });
  });

  test('should validate input correctly', async () => {
    const { result } = renderHook(() => useCharacterCount('Valid content with enough characters'));

    await waitFor(() => {
      expect(result.current.isValid).toBe(true);
      expect(result.current.error).toBeUndefined();
    }, { timeout: 500 });
  });

  test('should detect too short input', async () => {
    const { result } = renderHook(() => useCharacterCount('短'));

    await waitFor(() => {
      expect(result.current.isValid).toBe(false);
      expect(result.current.error).toBeDefined();
    }, { timeout: 500 });
  });

  test('should update count when text changes', async () => {
    const { result, rerender } = renderHook(
      ({ text }) => useCharacterCount(text),
      { initialProps: { text: 'Initial text' } }
    );

    await waitFor(() => {
      expect(result.current.count).toBe(12);
    }, { timeout: 500 });

    rerender({ text: 'New text content here' });

    await waitFor(() => {
      expect(result.current.count).toBe(21);
    }, { timeout: 500 });
  });
});
