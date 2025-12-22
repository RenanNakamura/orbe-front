import { Injectable } from '@angular/core';
import { TokenStorage } from '../../storage/user/token.storage';
import { RefreshTokenStorage } from '../../storage/user/refresh-token.storage';
import { WebSocketConnection } from "./websocket-connection";
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketManagerService {

  private connections = new Map<string, WebSocketConnection>();
  private refreshInProgress?: Promise<void>;

  constructor(
    private tokenStorage: TokenStorage,
    private refreshTokenStorage: RefreshTokenStorage,
    private userService: UserService
  ) {
  }

  getConnection(urlBase: string): WebSocketConnection {
    const tenantId = this.tokenStorage.getClaim('sub');

    if (!tenantId) throw new Error('No tenant');

    const fullUrl = `${urlBase}`;

    if (!this.connections.has(fullUrl)) {
      this.connections.set(fullUrl, new WebSocketConnection(
        fullUrl,
        this.tokenStorage,
        async () => this.handleAuthenticationFailure()
      ));
    }

    return this.connections.get(fullUrl)!;
  }

  private async handleAuthenticationFailure(): Promise<void> {
    if (this.refreshInProgress) {
      return this.refreshInProgress;
    }

    this.refreshInProgress = (async () => {
      const refreshToken = this.refreshTokenStorage.get();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await firstValueFrom(
        this.userService.refreshToken(refreshToken)
      );

      const newAccessToken = response.headers.get('Access-Token');
      const newRefreshToken = response.headers.get('Refresh-Token');

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Missing tokens in refresh response');
      }

      this.tokenStorage.set(newAccessToken);
      this.refreshTokenStorage.set(newRefreshToken);
    })();

    try {
      await this.refreshInProgress;
    } finally {
      this.refreshInProgress = undefined;
    }
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
