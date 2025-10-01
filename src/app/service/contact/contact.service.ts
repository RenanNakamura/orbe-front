import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {Contact, ContactParams} from '../../model/Contact';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    private _api = '/api/v1/contact';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: ContactParams): Observable<Page<Contact>> {
        const body = {
            search: params.search,
            operation: params.operation,
            conditions: params.conditions
        };
        return this._http.post<Page<Contact>>(`${environment.buddy}${this._api}/list`, body, {params: this.toHttpParams(params)});
    }

    create(contact: Contact) {
        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}`, contact));
    }

    update(contact: Contact) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${contact.id}`, contact));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete(`${environment.buddy}${this._api}/${id}`));
    }

    private toHttpParams(param?: ContactParams): HttpParams {
        let imutebleParams = new HttpParams();

        if (param?.size) {
            imutebleParams = imutebleParams.append('size', param.size);
        }
        if (param?.page) {
            imutebleParams = imutebleParams.append('page', param.page);
        }
        if (param?.sort) {
            imutebleParams = imutebleParams.append('sort', param.sort);
        }

        return imutebleParams;
    }

}
