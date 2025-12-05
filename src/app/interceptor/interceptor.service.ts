import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';
import {AlertService} from '../service/sk/alert.service';
import {TokenStorage} from '../storage/user/token.storage';
import {Router} from '@angular/router';
import {RefreshTokenStorage} from '../storage/user/refresh-token.storage';
import {UserService} from '../service/user/user.service';
import {UserStorage} from '../storage/user/user.storage';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../service/sk/language.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private _alert: AlertService,
    private _userService: UserService,
    private _userStorage: UserStorage,
    private _tokenStorage: TokenStorage,
    private _refreshTokenStorage: RefreshTokenStorage,
    private _translate: TranslateService,
    private _router: Router,
    private _languageService: LanguageService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipGlobalError = req.headers.has('X-Skip-Global-Error');

    if (req.url.includes('/refresh-token')) {
      return next.handle(req);
    }

    req = this.addAuthorizationHeader(req);
    req = this.addLocaleHeader(req);
    req = this.removeInternalHeaders(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        if (!skipGlobalError) {
          this.handleCommonErrors(error);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this._refreshTokenStorage.get();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    if (this.isRefreshing) {
      return this.queueRequest(request, next);
    }

    return this.performTokenRefresh(request, next, refreshToken);
  }

  private queueRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const clonedRequest = this.updateAuthorizationHeader(request, token!);
        return next.handle(clonedRequest);
      })
    );
  }

  private performTokenRefresh(
    request: HttpRequest<any>,
    next: HttpHandler,
    refreshToken: string
  ): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this._userService.refreshToken(refreshToken).pipe(
      catchError(refreshErr => {
        this.refreshTokenSubject.next(null);
        this.logout();
        return throwError(() => refreshErr);
      }),
      switchMap((response: HttpResponse<void>) => {
        const newAccessToken = response.headers.get('Access-Token');
        const newRefreshToken = response.headers.get('Refresh-Token');

        if (!newAccessToken || !newRefreshToken) {
          this.isRefreshing = false;
          this.logout();

          return throwError(() => new Error('Missing tokens in refresh response'));
        }

        this._tokenStorage.set(newAccessToken);
        this._refreshTokenStorage.set(newRefreshToken);

        const plan = this._tokenStorage.getClaim('plan');
        this._userStorage.set({...this._userStorage.get(), plan});

        this.refreshTokenSubject.next(newAccessToken);

        const clonedRequest = this.updateAuthorizationHeader(request, newAccessToken);
        return next.handle(clonedRequest)
          .pipe(
            catchError(retryErr => {
              return throwError(() => retryErr);
            })
          );
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this._tokenStorage.get();

    if (!token) {
      return request;
    }

    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private updateAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private addLocaleHeader(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Accept-Language', this.getLocale())
    });
  }

  private removeInternalHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let headers = request.headers;

    if (headers.has('X-Skip-Global-Error')) {
      headers = headers.delete('X-Skip-Global-Error');
    }

    return request.clone({headers});
  }

  private handleCommonErrors(response: HttpErrorResponse): void {
    const messages = response.error?.messages || response.error?.error;

    if (response.status >= 400 && response.status < 500) {
      if (Array.isArray(messages)) {
        messages.forEach(msg => this._alert.warning(msg));
      } else if (messages) {
        this._alert.warning(messages);
      }
    } else {
      this._alert.error(response.message || 'An error occurred');
    }
  }

  private getLocale(): string {
    return this._languageService.isPtBR() ? 'pt-BR' : 'en-US';
  }

  private logout(): void {
    this._tokenStorage.clear();
    this._refreshTokenStorage.clear();
    this._userStorage.clear();

    this._translate.get('user.session.expired')
      .subscribe(value => this._alert.warning(value));

    this._router.navigate(['/login']);
  }

}
