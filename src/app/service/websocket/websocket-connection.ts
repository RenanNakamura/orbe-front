import {Subject} from "rxjs";
import {TokenStorage} from "../../storage/user/token.storage";

export class WebSocketConnection {

  private static readonly MAX_RECONNECT_ATTEMPTS = 10;

  private socket?: WebSocket;
  private events$ = new Subject<any>();
  private heartbeat?: number;
  private reconnectAttempts = 0;
  private manuallyClosed = false;

  constructor(
    private url: string,
    private tokenStorage: TokenStorage
  ) {
  }

  connect() {
    if (this.socket) return;

    this.manuallyClosed = false;

    const token = this.tokenStorage.get();
    const wsUrl = token ? `${this.url}?token=${token}` : this.url;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected', { url: this.url, attempts: this.reconnectAttempts });
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        this.events$.next(data);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', e.data, error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('[WebSocket] Closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      this.handleClose();
    };
  }

  events() {
    return this.events$.asObservable();
  }

  send(data: any): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    console.warn('[WebSocket] Cannot send message, connection not open', {
      state: this.socket?.readyState
    });
    return false;
  }

  disconnect() {
    console.log('[WebSocket] Disconnecting manually');
    this.manuallyClosed = true;

    if (this.socket) {
      this.socket.close();
    }
  }

  complete() {
    this.disconnect();
    this.events$.complete();
  }

  private handleClose() {
    this.stopHeartbeat();
    this.socket = undefined;

    if (!this.manuallyClosed) {
      this.scheduleReconnect();
    }
  }

  private startHeartbeat() {
    this.heartbeat = window.setInterval(() => {
      this.send({type: 'PING'});
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeat) clearInterval(this.heartbeat);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= WebSocketConnection.MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebSocket] Max reconnection attempts reached', {
        attempts: this.reconnectAttempts
      });
      this.events$.error(new Error('Failed to reconnect after max attempts'));
      return;
    }

    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts++));
    console.log('[WebSocket] Scheduling reconnection', {
      attempt: this.reconnectAttempts,
      delayMs: delay
    });

    setTimeout(() => {
      if (!this.manuallyClosed) {
        this.connect();
      }
    }, delay);
  }
}
