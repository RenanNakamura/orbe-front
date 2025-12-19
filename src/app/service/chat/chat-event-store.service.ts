import {Injectable, OnDestroy} from '@angular/core';
import {ChatWebSocketService} from "./chat-websocket.service";
import {ChatService} from "./chat.service";
import {MessageCache} from "./message.cache";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

export interface WebSocketEvent {
  eventType: string;
  conversationId: string;
  timestamp: string;
}

export interface NewMessageEvent extends WebSocketEvent {
  message: any;
}

export interface MessageStatusEvent extends WebSocketEvent {
  messageId: string;
  status: string;
  wamid?: string;
}

export interface MessageErrorEvent extends WebSocketEvent {
  messageId: string;
  status: string;
  error: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatEventStoreService implements OnDestroy {

  private initialized = false;
  private sessionDestroyed$ = new Subject<void>();

  constructor(
    private _chatWebSocket: ChatWebSocketService,
    private _chatService: ChatService,
    private _messageCache: MessageCache
  ) {
  }

  init() {
    if (this.initialized) {
      return;
    }

    this._chatWebSocket.connect();

    this._chatWebSocket.events$
      .pipe(takeUntil(this.sessionDestroyed$))
      .subscribe(e => {
        console.log(e);
        switch (e.eventType) {
          case 'NEW_MESSAGE':
            this.handleNewMessage(e as NewMessageEvent);
            break;

          case 'MESSAGE_STATUS_UPDATED':
            this.handleMessageStatusUpdate(e as MessageStatusEvent);
            break;

          case 'MESSAGE_ERROR':
            this.handleMessageErrorUpdate(e as MessageErrorEvent);
            break;
        }
      });

    this.initialized = true;
  }

  private handleNewMessage(event: NewMessageEvent): void {
    const message = event.message;
    const conversation = this._messageCache.get(event.conversationId);

    if (conversation) {
      this._messageCache.push(event.conversationId, message);
    }

    this._chatService.messageReceived.next({
      conversationId: event.conversationId,
      message: message
    });
  }

  private handleMessageStatusUpdate(event: MessageStatusEvent): void {
    this._messageCache.updateStatus(event.conversationId, event.messageId, event.status);

    this._chatService.messageStatusUpdated.next({
      conversationId: event.conversationId,
      messageId: event.messageId,
      status: event.status
    });
  }

  private handleMessageErrorUpdate(event: MessageErrorEvent): void {
    this._messageCache.updateStatusAndError(event.conversationId, event.messageId, event.status, event.error);

    this._chatService.messageStatusUpdated.next({
      conversationId: event.conversationId,
      messageId: event.messageId,
      status: event.status,
      error: event?.error
    });
  }

  disconnect() {
    this.sessionDestroyed$.next();
    this.sessionDestroyed$.complete();
    this.sessionDestroyed$ = new Subject<void>();
    this._chatWebSocket.disconnect();
    this.initialized = false;
  }

  ngOnDestroy() {
    this.disconnect();
  }

}
