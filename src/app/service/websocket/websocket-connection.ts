import {Subject} from "rxjs";
import {TokenStorage} from "../../storage/user/token.storage";

export class WebSocketConnection {

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
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onmessage = e => {
      this.events$.next(JSON.parse(e.data));
    };

    this.socket.onclose = () => {
      console.log("WebSocket Connection closed");
      this.handleClose();
    };
  }

  events() {
    return this.events$.asObservable();
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.manuallyClosed = true;

    if (this.socket) {
      this.socket.close();
    }
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
    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts++));
    setTimeout(() => {
      if (!this.manuallyClosed) {
        this.connect();
      }
    }, delay);
  }
}
