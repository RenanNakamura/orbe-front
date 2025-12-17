import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {WebSocketManagerService} from "../websocket/websocket-manager.service";
import {WebSocketConnection, WebSocketStatus} from "../websocket/websocket-connection";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {

  private connection?: WebSocketConnection;
  private eventsSubject = new Subject<any>();
  private connectionSubscription?: Subscription;
  private statusSubscription?: Subscription;
  private statusSubject = new BehaviorSubject<WebSocketStatus>(WebSocketStatus.DISCONNECTED);

  constructor(private _wsManager: WebSocketManagerService) {
  }

  get events$() {
    return this.eventsSubject.asObservable();
  }

  get status$(): Observable<WebSocketStatus> {
    return this.statusSubject.asObservable();
  }

  getCurrentStatus(): WebSocketStatus {
    return this.statusSubject.value;
  }

  connect(): void {
    if (this.connection) {
      return;
    }

    this.connection = this._wsManager.getConnection(environment.chatWebSocket);

    this.connectionSubscription = this.connection
      .events()
      .subscribe({
        next: (event) => this.eventsSubject.next(event),
        error: (err) => {
          console.error('[ChatWebSocket] Connection error:', err);
          this.statusSubject.next(WebSocketStatus.ERROR);
        },
        complete: () => {
          console.log('[ChatWebSocket] Connection completed');
          this.statusSubject.next(WebSocketStatus.DISCONNECTED);
        }
      });

    this.statusSubscription = this.connection
      .status()
      .subscribe(status => {
        this.statusSubject.next(status);
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

    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }

    this.statusSubject.next(WebSocketStatus.DISCONNECTED);
  }

}
