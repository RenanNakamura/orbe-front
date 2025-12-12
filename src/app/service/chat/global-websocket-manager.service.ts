import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketService, WebSocketEvent, NewMessageEvent, MessageStatusEvent } from './websocket.service';
import { ChatService } from './chat.service';
import { MessageCache } from './message.cache';

@Injectable({
  providedIn: 'root'
})
export class GlobalWebSocketManager implements OnDestroy {

  private activeConversations = new Set<string>();
  private subscriptions = new Map<string, Subscription>();
  private destroy$ = new Subject<void>();
  private initialized = false;

  constructor(
    private wsService: WebSocketService,
    private chatService: ChatService,
    private messageCache: MessageCache
  ) {}

  initialize(): void {
    if (this.initialized) {
      console.debug('[GlobalWebSocketManager] Already initialized');
      return;
    }

    console.debug('[GlobalWebSocketManager] Initializing...');
    this.initialized = true;
  }

  subscribeToConversation(conversationId: string): void {
    if (this.activeConversations.has(conversationId)) {
      console.debug(`[GlobalWebSocketManager] Already subscribed to ${conversationId}`);
      return;
    }

    console.debug(`[GlobalWebSocketManager] Subscribing to ${conversationId}`);

    const sub = this.wsService.connect(conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => this.handleEvent(conversationId, event),
        error: (err) => {
          console.error(`[GlobalWebSocketManager] Error on ${conversationId}:`, err);
        },
        complete: () => {
          console.debug(`[GlobalWebSocketManager] Connection to ${conversationId} completed`);
          this.activeConversations.delete(conversationId);
          this.subscriptions.delete(conversationId);
        }
      });

    this.activeConversations.add(conversationId);
    this.subscriptions.set(conversationId, sub);
  }

  unsubscribeFromConversation(conversationId: string): void {
    const sub = this.subscriptions.get(conversationId);
    if (sub) {
      console.debug(`[GlobalWebSocketManager] Unsubscribing from ${conversationId}`);
      sub.unsubscribe();
      this.subscriptions.delete(conversationId);
      this.activeConversations.delete(conversationId);
      this.wsService.disconnect(conversationId);
    }
  }

  getActiveConversations(): string[] {
    return Array.from(this.activeConversations);
  }

  isSubscribed(conversationId: string): boolean {
    return this.activeConversations.has(conversationId);
  }

  private handleEvent(conversationId: string, event: WebSocketEvent): void {
    console.debug(`[GlobalWebSocketManager] Handling ${event.eventType} for ${conversationId}`);

    switch (event.eventType) {
      case 'NEW_MESSAGE':
        this.handleNewMessage(conversationId, event as NewMessageEvent);
        break;

      case 'MESSAGE_STATUS_UPDATED':
        this.handleStatusUpdate(conversationId, event as MessageStatusEvent);
        break;

      default:
        console.warn(`[GlobalWebSocketManager] Unknown event type: ${event.eventType}`);
    }
  }

  private handleNewMessage(conversationId: string, event: NewMessageEvent): void {
    const message = event.message;

    const existingCache = this.messageCache.get(conversationId);
    if (existingCache && existingCache.length > 0) {
      this.messageCache.push(conversationId, message);
      console.debug(`[GlobalWebSocketManager] Updated cache for ${conversationId}`);
    }

    // Emit to ChatService for components to consume
    this.chatService.messageReceived.next({
      conversationId: conversationId,
      message: message
    });
  }

  private handleStatusUpdate(conversationId: string, event: MessageStatusEvent): void {
    // Emit to ChatService for components to consume
    this.chatService.messageStatusUpdated.next({
      conversationId: conversationId,
      messageId: event.messageId,
      status: event.status
    });
  }

  ngOnDestroy(): void {
    console.debug('[GlobalWebSocketManager] Destroying, unsubscribing from all conversations');
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.forEach((sub, conversationId) => {
      sub.unsubscribe();
    });

    this.subscriptions.clear();
    this.activeConversations.clear();
    this.wsService.disconnectAll();
    this.initialized = false;
  }
}
