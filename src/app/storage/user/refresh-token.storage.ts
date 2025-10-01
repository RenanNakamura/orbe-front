import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenStorage {

    private _key = 'Refresh-Token';

    constructor() {
    }

    set(refreshToken: string | null): void {
        localStorage.setItem(this._key, refreshToken ?? '');
    }

    get(): string | null {
        return localStorage.getItem(this._key);
    }

    clear() {
        localStorage.removeItem(this._key);
    }

}
