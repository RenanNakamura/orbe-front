import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class TokenStorage {

    private _key = 'Authorization';

    constructor() {
    }

    set(token: string | null): void {
        localStorage.setItem(this._key, token ?? '');
    }

    get(): string | null {
        return localStorage.getItem(this._key);
    }

    clear() {
        localStorage.removeItem(this._key);
    }

    getClaim(claim: string) {
        const token = this.get();

        if (!token) {
            return null;
        }

        try {
            const parts = token.split('.');

            if (parts?.length !== 3) {
                return null;
            }

            const payload = JSON.parse(atob(parts[1]));

            return payload[claim] ?? null;
        } catch (e) {
            console.error('Error when decode token', e);
            return null;
        }
    }

}
