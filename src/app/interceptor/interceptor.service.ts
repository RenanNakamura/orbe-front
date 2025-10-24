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
import {catchError, filter, switchMap, take} from 'rxjs/operators';
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
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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
    if (req.url.includes('/refresh-token')) {
      return next.handle(req);
    }

    if (!req.headers.has('Authorization')) {
      req = this.addTokenHeader(req, this._tokenStorage.get() || '');
    }

    req = req.clone({
      headers: req.headers.set('Accept-Language', this.getLocale())
    });

    return next.handle(req)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          const data = {
            status: response.status,
            messages: response.error?.messages || response.error?.error
          };

          if (data.status === 401) {
            return this.handle401Error(req, next);
          } else if (data.status >= 400 && data.status < 500) {
            if (Array.isArray(data.messages)) {
              data.messages.forEach(msg => this._alert.warning(msg));
            } else {
              this._alert.warning(data.messages);
            }
          } else {
            this._alert.error(response.message);
          }

          return throwError(() => response);
        })
      );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this._refreshTokenStorage.get();

    if (!this.isRefreshing && refreshToken) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this._userService.refreshToken(refreshToken).pipe(
        switchMap((response: HttpResponse<void>) => {
          this.isRefreshing = false;

          const newAccessToken = response.headers.get('Access-Token');
          const newRefreshToken = response.headers.get('Refresh-Token');

          this._tokenStorage.set(newAccessToken);
          this._refreshTokenStorage.set(newRefreshToken);

          const plan = this._tokenStorage.getClaim('plan');
          this._userStorage.set({...this._userStorage.get(), plan});

          this.refreshTokenSubject.next(newAccessToken);

          return next.handle(this.addTokenHeader(request, newAccessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` || '',
      },
    });
  }

  private getLocale(): string {
    return this._languageService.isPtBR() ? 'pt-BR' : 'en-US';
  }

  private logout() {
    this._tokenStorage.clear();
    this._refreshTokenStorage.clear();
    this._userStorage.clear();

    this._translate.get('user.session.expired')
      .subscribe(value => this._alert.warning(value));

    this._router.navigate(['/login']);
  }
}
