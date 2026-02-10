export interface ClientMessage {
  type: 'translate';
  payload: {
    role: 'pm' | 'dev';
    content: string;
    timestamp: number;
  };
}

export interface ServerMessage {
  type: 'chunk' | 'done' | 'error';
  payload: {
    content?: string;
    error?: string;
    totalTokens?: number;
  };
}
