import { create } from 'zustand';
import type { TranslationState } from '@/types/translation';

export const useTranslationStore = create<TranslationState>((set) => ({
  role: null,
  inputText: '',
  translationResult: '',
  isStreaming: false,
  wsConnected: false,

  setRole: (role) => set({ role }),
  setInputText: (inputText) => set({ inputText }),
  appendStreamingText: (chunk) =>
    set((state) => ({
      translationResult: state.translationResult + chunk
    })),
  clearResult: () => set({ translationResult: '' }),
  setStreamingStatus: (isStreaming) => set({ isStreaming }),
  setWsStatus: (wsConnected) => set({ wsConnected })
}));
