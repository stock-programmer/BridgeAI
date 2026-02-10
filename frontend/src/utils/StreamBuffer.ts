import { STREAM_BUFFER_DELAY } from './constants';

/**
 * StreamBuffer - 流式文本缓冲器
 * 用于优化流式文本的渲染性能，避免频繁的DOM更新
 */
export class StreamBuffer {
  private buffer: string = '';
  private flushTimer: number | null = null;
  private flushCallback: (text: string) => void;
  private delay: number;

  constructor(flushCallback: (text: string) => void, delay: number = STREAM_BUFFER_DELAY) {
    this.flushCallback = flushCallback;
    this.delay = delay;
  }

  /**
   * Add text chunk to buffer
   */
  append(chunk: string): void {
    this.buffer += chunk;

    // Clear existing timer
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
    }

    // Schedule flush
    this.flushTimer = window.setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  /**
   * Immediately flush buffer to callback
   */
  flush(): void {
    if (this.buffer.length > 0) {
      this.flushCallback(this.buffer);
      this.buffer = '';
    }

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Clear buffer and timer
   */
  clear(): void {
    this.buffer = '';

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Get current buffer content without flushing
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * Check if buffer is empty
   */
  isEmpty(): boolean {
    return this.buffer.length === 0;
  }
}
