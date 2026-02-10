import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '../useClipboard';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useClipboard', () => {
  let writeTextMock: any;

  beforeEach(() => {
    // Mock clipboard API
    writeTextMock = vi.fn(() => Promise.resolve());
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    });
    // Mock isSecureContext
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard('Test content');
      expect(success).toBe(true);
    });

    expect(result.current.isCopied).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Test content');
  });

  test('should reset isCopied after delay', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('Test content');
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isCopied).toBe(false);

    vi.useRealTimers();
  });

  test('should fallback to execCommand when clipboard API not available', async () => {
    // Remove clipboard API
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: false
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard('Test content');
      expect(success).toBe(true);
    });

    expect(result.current.isCopied).toBe(true);
  });

  test('should handle copy failure gracefully', async () => {
    // Mock clipboard API to fail
    const failMock = vi.fn(() => Promise.reject(new Error('Failed')));
    Object.assign(navigator, {
      clipboard: {
        writeText: failMock
      }
    });

    // Also make execCommand fail
    document.execCommand = vi.fn(() => false) as any;

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard('Test content');
      expect(success).toBe(false);
    });

    expect(result.current.isCopied).toBe(false);
  });
});
