import {Injectable} from '@angular/core';
import {ChatWebSocketService} from "./chat-websocket.service";
import {ChatService} from "./chat.service";
import {MessageCache} from "./message.cache";

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
export class ChatEventStoreService {

  constructor(private _chatWebSocket: ChatWebSocketService,
              private _chatService: ChatService,
              private _messageCache: MessageCache
  ) {
  }

  init() {
    this._chatWebSocket.events$
      .subscribe(e => {
        switch (e.eventType) {
          case 'NEW_MESSAGE':
            this.handleNewMessage(e as NewMessageEvent);
            break;

          case 'MESSAGE_STATUS_UPDATED':
            this.handleStatusUpdate(e as MessageStatusEvent);
            break;
        }
      });
  }

  private handleNewMessage(event: NewMessageEvent): void {
    const message = event.message;
    const conversation = this._messageCache.get(event.conversationId);

    if (conversation) {
      this._messageCache.push(event.conversationId, message);
      this._chatService.messageReceived.next({
        conversationId: event.conversationId,
        message: message
      });
    }
  }

  private handleStatusUpdate(event: MessageStatusEvent): void {
    this._chatService.messageStatusUpdated.next({
      conversationId: event.conversationId,
      messageId: event.messageId,
      status: event.status
    });
  }

}
