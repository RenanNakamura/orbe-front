import {Injectable} from '@angular/core';
import {TokenStorage} from '../../storage/user/token.storage';
import {WebSocketConnection} from "./websocket-connection";

@Injectable({providedIn: 'root'})
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
    this.connections.forEach(c => c.disconnect());
    this.connections.clear();
  }
}
