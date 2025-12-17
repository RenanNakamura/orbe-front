import {BehaviorSubject, Subject} from "rxjs";
import {TokenStorage} from "../../storage/user/token.storage";

export enum WebSocketStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR'
}

export class WebSocketConnection {

  private static readonly MAX_RECONNECT_ATTEMPTS = 10;

  private socket?: WebSocket;
  private events$ = new Subject<any>();
  private status$ = new BehaviorSubject<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
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
    this.status$.next(this.reconnectAttempts > 0 ? WebSocketStatus.RECONNECTING : WebSocketStatus.CONNECTING);

    const token = this.tokenStorage.get();
    const wsUrl = token ? `${this.url}?token=${token}` : this.url;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected', { url: this.url, attempts: this.reconnectAttempts });
      this.reconnectAttempts = 0;
      this.status$.next(WebSocketStatus.CONNECTED);
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
      this.status$.next(WebSocketStatus.ERROR);
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

  status() {
    return this.status$.asObservable();
  }

  getCurrentStatus(): WebSocketStatus {
    return this.status$.value;
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
    this.status$.next(WebSocketStatus.DISCONNECTED);

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
    this.status$.next(WebSocketStatus.DISCONNECTED);

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
      this.status$.next(WebSocketStatus.ERROR);
      this.events$.error(new Error('Failed to reconnect after max attempts'));
      return;
    }

    this.status$.next(WebSocketStatus.RECONNECTING);
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
