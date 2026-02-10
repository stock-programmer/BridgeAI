# 前端开发任务 2.1: WebSocket服务封装

## 任务信息
- **任务ID**: `SERVICE-001`
- **依赖**: `TYPE-001` (WebSocket类型), `UTIL-001` (常量)
- **并行组**: Group-1
- **预估工时**: 25分钟

## 产出物
`src/services/websocket.ts`

## 核心功能
1. 创建 WebSocket 连接
2. 自动重连机制
3. 消息发送/接收
4. 事件监听管理

## 关键代码
```typescript
class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, Function> = new Map();

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.addEventListener('open', this.handleOpen);
    this.ws.addEventListener('message', this.handleMessage);
    // ... 其他事件处理
  }

  send(message: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const wsService = new WebSocketService();
```

## 验证
- [ ] WebSocket 可以连接
- [ ] 自动重连生效
- [ ] 消息正确发送/接收

---
**创建时间**: 2026-02-09
