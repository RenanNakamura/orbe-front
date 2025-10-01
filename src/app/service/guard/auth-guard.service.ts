import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {TokenStorage} from '../../storage/user/token.storage';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private _storage: TokenStorage,
                private _router: Router) {
    }

    canActivate() {
        const token = this._storage.get();
        if (!token) {
            this._router.navigate(['/login']);
            return false;
        }
        return true;
    }

}
