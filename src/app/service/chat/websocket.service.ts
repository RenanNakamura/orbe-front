import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, delayWhen, share, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorage } from '../../storage/user/token.storage';

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
export class WebSocketService implements OnDestroy {

  private connections = new Map<string, Observable<WebSocketEvent>>();
  private subjects = new Map<string, WebSocketSubject<WebSocketEvent>>();
  private destroy$ = new Subject<void>();

  constructor(private _tokenStorage: TokenStorage) {}

  private getTenant(): string | null {
    return this._tokenStorage.getClaim('sub');
  }

  connect(conversationId: string): Observable<WebSocketEvent> {
    // Return existing connection if already established
    if (this.connections.has(conversationId)) {
      console.debug(`[WebSocketService] Reusing existing connection for ${conversationId}`);
      return this.connections.get(conversationId)!;
    }

    const tenant = this.getTenant();
    if (!tenant) {
      console.error('[WebSocketService] Cannot connect: no tenant available');
      return new Observable(observer => observer.error('No tenant'));
    }

    const token = this._tokenStorage.get();
    if (!token) {
      console.error('[WebSocketService] Cannot connect: no token available');
      return new Observable(observer => observer.error('No token'));
    }

    // Build WebSocket URL
    const wsUrl = environment.chat.replace('http', 'ws') +
                  `/ws/conversations/${conversationId}?token=${token}`;

    console.debug(`[WebSocketService] Creating WebSocket connection for ${conversationId}`);

    // Create RxJS WebSocket subject
    const ws$ = webSocket<WebSocketEvent>({
      url: wsUrl,
      deserializer: (e: MessageEvent) => JSON.parse(e.data),
      openObserver: {
        next: () => {
          console.debug(`[WebSocketService] ✅ Connected to ${conversationId}`);
        }
      },
      closeObserver: {
        next: () => {
          console.debug(`[WebSocketService] ❌ Disconnected from ${conversationId}`);
        }
      }
    });

    this.subjects.set(conversationId, ws$);

    // Create auto-reconnecting observable with exponential backoff
    const reconnecting$ = ws$.pipe(
      tap(event => {
        console.debug(`[WebSocketService] 📨 Received event for ${conversationId}:`, event.eventType);
      }),
      retryWhen(errors => errors.pipe(
        tap(err => {
          console.error(`[WebSocketService] ⚠️ Error on ${conversationId}:`, err);
        }),
        delayWhen((_, attemptIndex) => {
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
          const delay = Math.min(1000 * Math.pow(2, attemptIndex), 30000);
          console.debug(`[WebSocketService] 🔄 Reconnecting to ${conversationId} in ${delay}ms (attempt ${attemptIndex + 1})`);
          return timer(delay);
        })
      )),
      share(), // Multicast - multiple subscribers share same connection
      takeUntil(this.destroy$) // Cleanup on service destroy
    );

    // Cache the observable
    this.connections.set(conversationId, reconnecting$);

    return reconnecting$;
  }

  disconnect(conversationId: string): void {
    const subject = this.subjects.get(conversationId);
    if (subject) {
      console.debug(`[WebSocketService] Disconnecting from ${conversationId}`);
      subject.complete();
      this.subjects.delete(conversationId);
      this.connections.delete(conversationId);
    }
  }

  disconnectAll(): void {
    console.debug(`[WebSocketService] Disconnecting from all conversations (${this.subjects.size})`);
    this.subjects.forEach((subject, conversationId) => {
      subject.complete();
    });
    this.subjects.clear();
    this.connections.clear();
  }

  send(conversationId: string, message: any): void {
    const subject = this.subjects.get(conversationId);
    if (subject) {
      subject.next(message);
    } else {
      console.warn(`[WebSocketService] Cannot send: not connected to ${conversationId}`);
    }
  }

  ngOnDestroy(): void {
    console.debug('[WebSocketService] Service destroying, closing all connections');
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectAll();
  }
}
