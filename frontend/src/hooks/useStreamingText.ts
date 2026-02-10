import { useEffect, useRef, useCallback } from 'react';
import { StreamBuffer } from '@/utils/StreamBuffer';
import { STREAM_BUFFER_DELAY } from '@/utils/constants';

/**
 * useStreamingText Hook
 * 优化流式文本的渲染性能，使用缓冲机制批量更新文本
 */
export const useStreamingText = (
  onTextUpdate: (text: string) => void,
  delay: number = STREAM_BUFFER_DELAY
) => {
  const bufferRef = useRef<StreamBuffer | null>(null);

  // Initialize buffer
  useEffect(() => {
    bufferRef.current = new StreamBuffer(onTextUpdate, delay);

    return () => {
      // Flush remaining buffer on unmount
      if (bufferRef.current) {
        bufferRef.current.flush();
      }
    };
  }, [onTextUpdate, delay]);

  // Append text chunk to buffer
  const appendChunk = useCallback((chunk: string) => {
    if (bufferRef.current) {
      bufferRef.current.append(chunk);
    }
  }, []);

  // Force flush buffer
  const flush = useCallback(() => {
    if (bufferRef.current) {
      bufferRef.current.flush();
    }
  }, []);

  // Clear buffer
  const clear = useCallback(() => {
    if (bufferRef.current) {
      bufferRef.current.clear();
    }
  }, []);

  return {
    appendChunk,
    flush,
    clear
  };
};
