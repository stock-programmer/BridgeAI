import { useState, useCallback } from 'react';

const RESET_DELAY = 2000; // 2 seconds

/**
 * useClipboard Hook
 * 封装复制到剪贴板功能
 */
export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        // Reset isCopied state after delay
        setTimeout(() => {
          setIsCopied(false);
        }, RESET_DELAY);

        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (success) {
        setIsCopied(true);

        // Reset isCopied state after delay
        setTimeout(() => {
          setIsCopied(false);
        }, RESET_DELAY);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  return {
    copyToClipboard,
    isCopied
  };
};
