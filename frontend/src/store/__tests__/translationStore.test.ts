import { describe, test, expect, beforeEach } from 'vitest';
import { useTranslationStore } from '../translationStore';

describe('translationStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useTranslationStore.getState();
    store.setRole(null);
    store.setInputText('');
    store.clearResult();
    store.setStreamingStatus(false);
    store.setWsStatus(false);
  });

  test('should initialize with default state', () => {
    const state = useTranslationStore.getState();
    expect(state.role).toBeNull();
    expect(state.inputText).toBe('');
    expect(state.translationResult).toBe('');
    expect(state.isStreaming).toBe(false);
    expect(state.wsConnected).toBe(false);
  });

  test('should set role', () => {
    const { setRole } = useTranslationStore.getState();
    setRole('pm');
    expect(useTranslationStore.getState().role).toBe('pm');

    setRole('dev');
    expect(useTranslationStore.getState().role).toBe('dev');
  });

  test('should set input text', () => {
    const { setInputText } = useTranslationStore.getState();
    setInputText('Test input');
    expect(useTranslationStore.getState().inputText).toBe('Test input');
  });

  test('should append streaming text', () => {
    const { appendStreamingText } = useTranslationStore.getState();

    appendStreamingText('Hello ');
    expect(useTranslationStore.getState().translationResult).toBe('Hello ');

    appendStreamingText('World');
    expect(useTranslationStore.getState().translationResult).toBe('Hello World');
  });

  test('should clear result', () => {
    const { appendStreamingText, clearResult } = useTranslationStore.getState();

    appendStreamingText('Some content');
    expect(useTranslationStore.getState().translationResult).toBe('Some content');

    clearResult();
    expect(useTranslationStore.getState().translationResult).toBe('');
  });

  test('should set streaming status', () => {
    const { setStreamingStatus } = useTranslationStore.getState();

    setStreamingStatus(true);
    expect(useTranslationStore.getState().isStreaming).toBe(true);

    setStreamingStatus(false);
    expect(useTranslationStore.getState().isStreaming).toBe(false);
  });

  test('should set WebSocket connection status', () => {
    const { setWsStatus } = useTranslationStore.getState();

    setWsStatus(true);
    expect(useTranslationStore.getState().wsConnected).toBe(true);

    setWsStatus(false);
    expect(useTranslationStore.getState().wsConnected).toBe(false);
  });

  test('should handle complete translation flow', () => {
    const store = useTranslationStore.getState();

    // Start translation
    store.setRole('pm');
    store.setInputText('Test input');
    store.setStreamingStatus(true);

    expect(useTranslationStore.getState().role).toBe('pm');
    expect(useTranslationStore.getState().inputText).toBe('Test input');
    expect(useTranslationStore.getState().isStreaming).toBe(true);

    // Receive chunks
    store.appendStreamingText('Chunk 1 ');
    store.appendStreamingText('Chunk 2');

    expect(useTranslationStore.getState().translationResult).toBe('Chunk 1 Chunk 2');

    // Complete translation
    store.setStreamingStatus(false);

    expect(useTranslationStore.getState().isStreaming).toBe(false);
    expect(useTranslationStore.getState().translationResult).toBe('Chunk 1 Chunk 2');
  });
});
