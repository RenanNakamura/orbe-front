import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {WebSocketManagerService} from "../websocket/websocket-manager.service";
import {WebSocketConnection} from "../websocket/websocket-connection";
import {EMPTY} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {

  private connection?: WebSocketConnection;

  constructor(private _wsManager: WebSocketManagerService
  ) {
  }

  get events$() {
    return this.connection?.events() ?? EMPTY;
  }

  connect(): void {
    if (!this.connection) {
      this.connection = this._wsManager.getConnection(environment.chatWebSocket);
      this.connection.connect();
    }
  }

  disconnect(): void {
    this.connection?.disconnect();
    this.connection = undefined;
  }

}
