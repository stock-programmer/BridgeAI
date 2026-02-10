export type Role = 'pm' | 'dev';

export interface TranslationState {
  role: Role | null;
  inputText: string;
  translationResult: string;
  isStreaming: boolean;
  wsConnected: boolean;

  // Actions
  setRole: (role: Role) => void;
  setInputText: (text: string) => void;
  appendStreamingText: (chunk: string) => void;
  clearResult: () => void;
  setStreamingStatus: (status: boolean) => void;
  setWsStatus: (status: boolean) => void;
}
