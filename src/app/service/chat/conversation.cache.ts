import {Injectable} from '@angular/core';
import {Conversation} from "../../model/chat/conversation";

@Injectable({
  providedIn: 'root'
})
export class ConversationCache {

  private cache = new Map<string, Conversation>();

  set(conversation: Conversation) {
    if (conversation?.id) {
      this.cache.set(conversation.id, conversation);
    }
  }

  get(id: string): Conversation | undefined {
    return this.cache.get(id);
  }

  delete(id: string) {
    this.cache.delete(id);
  }

  clearAll() {
    this.cache.clear();
  }

}
