import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TokenStorage} from '../../storage/user/token.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _tokenStorage: TokenStorage,
              private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this._tokenStorage.get();

    if (!token) {
      this._router.navigate(['/login']);
      return false;
    }

    const isUserToken = this._tokenStorage.isUserToken();

    const allowedForAgent = ['/chat', '/my-account'];
    const currentUrl = state.url.split('?')[0];

    if (!isUserToken && !allowedForAgent.some(p => currentUrl.startsWith(p))) {
      this._router.navigate(['/chat']);
      return false;
    }

    return true;
  }

}
