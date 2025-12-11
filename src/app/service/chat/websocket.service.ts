import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
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

  private connections = new Map<string, WebSocket>();
  private connected$ = new BehaviorSubject<boolean>(false);
  private eventSubject = new Subject<WebSocketEvent>();

  public events$ = this.eventSubject.asObservable();
  public isConnected$ = this.connected$.asObservable();

  constructor(private _tokenStorage: TokenStorage) {}

  private getTenant(): string | null {
    // Extrair tenant do token sempre que necessário (não cachear)
    return this._tokenStorage.getClaim('sub');
  }

  connect(): void {
    const tenant = this.getTenant();
    if (!tenant) {
      console.error('No tenant found in token');
      return;
    }
    console.log('WebSocket service initialized for tenant:', tenant);
  }

  disconnect(): void {
    this.connections.forEach((ws, key) => {
      ws.close();
    });
    this.connections.clear();
  }

  subscribeToConversation(conversationId: string): void {
    const tenant = this.getTenant();
    if (!tenant) {
      console.error('Cannot subscribe: no tenant available');
      return;
    }

    if (this.connections.has(conversationId)) {
      console.log(`Already subscribed to conversation ${conversationId}`);
      return;
    }

    const token = this._tokenStorage.get();
    if (!token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    // Construir URL WebSocket com token no query param
    const wsUrl = environment.chat.replace('http', 'ws') + 
                  `/ws/conversations/${conversationId}?token=${token}`;

    // Criar WebSocket nativo
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected to conversation ${conversationId}`);
      this.connected$.next(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`[WebSocketService] Received message for ${conversationId}:`, data);
        this.eventSubject.next(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for conversation ${conversationId}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected from conversation ${conversationId}`);
      this.connections.delete(conversationId);
      
      if (this.connections.size === 0) {
        this.connected$.next(false);
      }

      // Tentar reconectar após 5 segundos
      setTimeout(() => {
        const tenant = this.getTenant();
        if (tenant) {
          console.log(`Attempting to reconnect to conversation ${conversationId}`);
          this.subscribeToConversation(conversationId);
        }
      }, 5000);
    };

    this.connections.set(conversationId, ws);
  }

  unsubscribeFromConversation(conversationId: string): void {
    const ws = this.connections.get(conversationId);
    if (ws) {
      ws.close();
      this.connections.delete(conversationId);
      console.log(`Unsubscribed from conversation ${conversationId}`);
    }
  }

  getEventsForConversation(conversationId: string): Observable<WebSocketEvent> {
    return this.events$.pipe(
      filter(event => event.conversationId === conversationId)
    );
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
