import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {environment} from '../../../environments/environment';
import { Channel, ChannelParams, ChannelWithFacebookEmbeddedSignup } from '../../model/Channel';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {

    private _api = '/api/v1/channel';

    constructor(private readonly _http: HttpClient) {
    }

    get(id: string): Observable<Channel> {
        return this._http.get<Channel>(`${environment.buddy}${this._api}/${id}`);
    }

    list(params: ChannelParams): Observable<Page<Channel>> {
        return this._http.get<Page<Channel>>(`${environment.buddy}${this._api}`, {params: this.toHttpParams(params)});
    }

    create(channel: Channel) {
        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}`, channel));
    }

    createWith(channel: ChannelWithFacebookEmbeddedSignup) {
        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}/facebook`, channel));
    }

    update(channel: Channel) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${channel.id}`, channel));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete(`${environment.buddy}${this._api}/${id}`));
    }

    private toHttpParams(param?: ChannelParams): HttpParams {
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
        if (param?.search) {
            imutebleParams = imutebleParams.append('search', param.search);
        }

        return imutebleParams;
    }

}
