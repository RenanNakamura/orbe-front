import {Injectable} from '@angular/core';
import {Conversation, Message} from "../../model/chat/conversation";

@Injectable({
  providedIn: 'root'
})
export class MessageCache {

  private cache = new Map<string, Message[]>();
  private MAX = 60;

  get(conversationId: string): Message[] | undefined {
    return this.cache.get(conversationId);
  }

  push(conversationId: string, message: Message) {
    const list = this.cache.get(conversationId) ?? [];

    list.push(message);

    if (list.length > this.MAX) {
      list.shift();
    }

    this.cache.set(conversationId, list);
  }

  setAll(conversationId: string, messages: Message[]) {
    const sliced = messages.slice(-this.MAX);
    this.cache.set(conversationId, sliced);
  }

  clear(conversationId: string) {
    this.cache.delete(conversationId);
  }

}
