import {Injectable} from '@angular/core';
import {LoggedUser} from '../../model/User';

@Injectable({
    providedIn: 'root'
})
export class UserStorage {

    private _key = 'user';

    constructor() {
    }

    set(user: LoggedUser) {
        localStorage.setItem(this._key, JSON.stringify(user));
    }

    get(): LoggedUser {
        return JSON.parse(localStorage.getItem(this._key) || '') as LoggedUser;
    }

    clear() {
        localStorage.removeItem(this._key);
    }

}
