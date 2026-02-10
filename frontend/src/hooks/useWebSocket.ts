import { useEffect } from 'react';
import { useTranslationStore } from '@/store/translationStore';
import { wsService } from '@/services/websocket';
import type { Role } from '@/types/translation';
import type { ServerMessage } from '@/types/websocket';

export const useWebSocket = () => {
  const { setWsStatus, appendStreamingText, setStreamingStatus } =
    useTranslationStore();

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

    // Connect to WebSocket
    wsService.connect(wsUrl);

    // Handle connection open
    const unsubscribeOpen = wsService.onOpen(() => {
      setWsStatus(true);
    });

    // Handle connection close
    const unsubscribeClose = wsService.onClose(() => {
      setWsStatus(false);
    });

    // Handle incoming messages
    const unsubscribeMessage = wsService.onMessage((message: ServerMessage) => {
      switch (message.type) {
        case 'chunk':
          if (message.payload.content) {
            appendStreamingText(message.payload.content);
          }
          break;
        case 'done':
          setStreamingStatus(false);
          break;
        case 'error':
          setStreamingStatus(false);
          console.error('Translation error:', message.payload.error);
          break;
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeMessage();
      wsService.disconnect();
    };
  }, [setWsStatus, appendStreamingText, setStreamingStatus]);

  const sendTranslation = (role: Role, content: string) => {
    setStreamingStatus(true);
    wsService.send({
      type: 'translate',
      payload: { role, content, timestamp: Date.now() }
    });
  };

  return { sendTranslation };
};
