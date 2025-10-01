import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PhoneNumberInfo} from '../../model/PhoneNumberInfo';

@Injectable({
    providedIn: 'root'
})
export class PhoneNumberInfoService {

    private _api = '/api/v1/phone-numbers';

    constructor(private readonly _http: HttpClient) { }

    get(channelId: string): Observable<PhoneNumberInfo> {
        return this._http.get<PhoneNumberInfo>(`${environment.buddy}${this._api}/${channelId}`);
    }
}
