import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Message} from '../../model/chat/conversation';
import {MessageErrorEvent} from "./chat-event-store.service";

export interface MessageSentEvent {
  conversationId: string;
  message: Message;
}

export interface MessageReceivedEvent {
  conversationId: string;
  message: Message;
}

export interface MessageStatusUpdatedEvent {
  conversationId: string;
  messageId: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  drawerOpen = new BehaviorSubject<boolean>(false);
  drawerOpen$ = this.drawerOpen.asObservable();

  messageSent = new Subject<MessageSentEvent>();
  messageSent$ = this.messageSent.asObservable();

  // WebSocket events
  messageReceived = new Subject<MessageReceivedEvent>();
  messageReceived$ = this.messageReceived.asObservable();

  messageStatusUpdated = new Subject<MessageStatusUpdatedEvent | MessageErrorEvent>();
  messageStatusUpdated$ = this.messageStatusUpdated.asObservable();

}
