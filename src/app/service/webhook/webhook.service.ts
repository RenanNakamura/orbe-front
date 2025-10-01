import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Webhook} from '../../model/Webhook';

@Injectable({
    providedIn: 'root'
})
export class WebhookService {

    private _api = '/api/v1/webhook';

    constructor(private readonly _http: HttpClient) {
    }

    get(): Observable<Webhook> {
        return this._http.get<Webhook>(`${environment.buddy}${this._api}`);
    }

    create(webhook: Webhook) {
        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}`, webhook));
    }

    update(webhook: Webhook) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${webhook.id}`, webhook));
    }

}
