import type { ClientMessage, ServerMessage } from '../types/websocket';
import { WS_RECONNECT_MAX_RETRIES, WS_RECONNECT_DELAY } from '../utils/constants';

type MessageHandler = (message: ServerMessage) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Event) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts: number = 0;
  private reconnectTimer: number | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private openHandlers: Set<ConnectionHandler> = new Set();
  private closeHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private isManualClose: boolean = false;

  /**
   * Connect to WebSocket server
   */
  connect(url: string): void {
    this.url = url;
    this.isManualClose = false;
    this.createConnection();
  }

  /**
   * Create WebSocket connection
   */
  private createConnection(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.addEventListener('open', this.handleOpen);
      this.ws.addEventListener('message', this.handleMessage);
      this.ws.addEventListener('close', this.handleClose);
      this.ws.addEventListener('error', this.handleError);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen = (): void => {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;

    // Notify all open handlers
    this.openHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('Error in open handler:', error);
      }
    });
  };

  /**
   * Handle WebSocket message event
   */
  private handleMessage = (event: MessageEvent): void => {
    try {
      const message: ServerMessage = JSON.parse(event.data);

      // Notify all message handlers
      this.messageHandlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  /**
   * Handle WebSocket close event
   */
  private handleClose = (): void => {
    console.log('WebSocket closed');

    // Notify all close handlers
    this.closeHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('Error in close handler:', error);
      }
    });

    // Auto-reconnect if not manually closed
    if (!this.isManualClose) {
      this.scheduleReconnect();
    }
  };

  /**
   * Handle WebSocket error event
   */
  private handleError = (event: Event): void => {
    console.error('WebSocket error:', event);

    // Notify all error handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in error handler:', error);
      }
    });
  };

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= WS_RECONNECT_MAX_RETRIES) {
      console.error('Max reconnect attempts reached');
      return;
    }

    if (this.reconnectTimer !== null) {
      return; // Already scheduled
    }

    this.reconnectAttempts++;
    const delay = WS_RECONNECT_DELAY * this.reconnectAttempts;

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${WS_RECONNECT_MAX_RETRIES} in ${delay}ms`);

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.createConnection();
    }, delay);
  }

  /**
   * Send message to server
   */
  send(message: ClientMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }

    console.warn('WebSocket is not open. Current state:', this.ws?.readyState);
    return false;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualClose = true;

    // Clear reconnect timer
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.removeEventListener('open', this.handleOpen);
      this.ws.removeEventListener('message', this.handleMessage);
      this.ws.removeEventListener('close', this.handleClose);
      this.ws.removeEventListener('error', this.handleError);

      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }

      this.ws = null;
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Add message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Add open handler
   */
  onOpen(handler: ConnectionHandler): () => void {
    this.openHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.openHandlers.delete(handler);
    };
  }

  /**
   * Add close handler
   */
  onClose(handler: ConnectionHandler): () => void {
    this.closeHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.closeHandlers.delete(handler);
    };
  }

  /**
   * Add error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Get connection state
   */
  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
