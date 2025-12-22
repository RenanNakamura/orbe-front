import {Injectable} from '@angular/core';
import {Message} from "../../model/chat/conversation";

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

  delete(conversationId: string) {
    this.cache.delete(conversationId);
  }

  clear() {
    this.cache.clear();
  }

  updateStatus(conversationId: string, messageId: string, status: string): boolean {
    const messages = this.cache.get(conversationId);

    if (!messages) {
      return false;
    }

    const updated = messages.map(msg =>
      msg.id === messageId ? {...msg, status: status as any} : msg
    );

    this.cache.set(conversationId, updated);
    return true;
  }

  updateStatusAndError(conversationId: string, messageId: string, status: string, error: any): boolean {
    const messages = this.cache.get(conversationId);

    if (!messages) {
      return false;
    }

    const updated = messages.map(msg =>
      msg.id === messageId ? {...msg, status: status as any, error: error} : msg
    );

    this.cache.set(conversationId, updated);

    return true;
  }

}
