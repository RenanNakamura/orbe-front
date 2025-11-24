import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Message} from '../../model/chat/conversation';

export interface MessageSentEvent {
  conversationId: string;
  message: Message;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  drawerOpen = new BehaviorSubject<boolean>(false);
  drawerOpen$ = this.drawerOpen.asObservable();

  messageSent = new Subject<MessageSentEvent>();
  messageSent$ = this.messageSent.asObservable();

}
