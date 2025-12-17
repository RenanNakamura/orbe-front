import { Injectable } from '@angular/core';
import { TokenStorage } from '../../storage/user/token.storage';
import { WebSocketConnection } from "./websocket-connection";

@Injectable({ providedIn: 'root' })
export class WebSocketManagerService {

  private connections = new Map<string, WebSocketConnection>();

  constructor(private tokenStorage: TokenStorage) {
  }

  getConnection(urlBase: string): WebSocketConnection {
    const tenantId = this.tokenStorage.getClaim('sub');

    if (!tenantId) throw new Error('No tenant');

    // const fullUrl = `${urlBase}/${tenantId}`; // TODO voltar essa parte do codigo
    const fullUrl = `${urlBase}`;

    if (!this.connections.has(fullUrl)) {
      this.connections.set(fullUrl, new WebSocketConnection(fullUrl, this.tokenStorage));
    }

    return this.connections.get(fullUrl)!;
  }

  disconnectAll() {
    console.log('[WebSocketManager] Disconnecting all connections', {
      count: this.connections.size
    });
    this.connections.forEach(c => c.complete());
    this.connections.clear();
  }

  removeConnection(urlBase: string) {
    const fullUrl = `${urlBase}`;
    if (this.connections.has(fullUrl)) {
      console.log('[WebSocketManager] Removing connection', { url: fullUrl });
      const connection = this.connections.get(fullUrl);
      connection?.complete();
      this.connections.delete(fullUrl);
    }
  }
}
