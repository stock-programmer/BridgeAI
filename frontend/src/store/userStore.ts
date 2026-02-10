import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'zh' | 'en';
  };
  history: Array<{
    id: string;
    timestamp: number;
    role: 'pm' | 'dev';
    content: string;
  }>;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  addHistory: (item: any) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {
        theme: 'auto',
        language: 'zh'
      },
      history: [],
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme }
        })),
      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50) // 最多50条
        }))
    }),
    {
      name: 'user-storage'
    }
  )
);
