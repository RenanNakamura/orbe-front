import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { WebSocketManagerService } from "../websocket/websocket-manager.service";
import { WebSocketConnection } from "../websocket/websocket-connection";
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {

  private connection?: WebSocketConnection;
  private eventsSubject = new Subject<any>();
  private connectionSubscription?: Subscription;

  constructor(private _wsManager: WebSocketManagerService
  ) {
  }

  get events$() {
    return this.eventsSubject.asObservable();
  }

  connect(): void {
    if (this.connection) {
      return;
    }

    this.connection = this._wsManager.getConnection(environment.chatWebSocket);

    this.connectionSubscription = this.connection.events().subscribe({
      next: (event) => this.eventsSubject.next(event),
      error: (err) => console.error('[ChatWebSocket] Connection error:', err),
      complete: () => console.log('[ChatWebSocket] Connection completed')
    });

    this.connection.connect();
  }

  disconnect(): void {
    if (this.connection) {
      this._wsManager.removeConnection(environment.chatWebSocket);
      this.connection = undefined;
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
      this.connectionSubscription = undefined;
    }
  }

}
