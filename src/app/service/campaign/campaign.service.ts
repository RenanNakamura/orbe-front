import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {Campaign, CampaignDashboard, CampaignParams, CreateCampaign} from '../../model/Campaign';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CampaignService {

    private _api = '/api/v1/campaign';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: CampaignParams): Observable<Page<Campaign>> {
        return this._http.get<Page<Campaign>>(`${environment.campaign}${this._api}`, {params: this.toHttpParams(params)});
    }

    get(id: string): Observable<Campaign> {
        return this._http.get<Campaign>(`${environment.campaign}${this._api}/${id}`);
    }

    dashboard(id: string): Observable<CampaignDashboard> {
        return this._http.get<CampaignDashboard>(`${environment.campaign}${this._api}/${id}/dashboard`);
    }

    create(campaign: CreateCampaign) {
        return firstValueFrom(this._http.post(`${environment.campaign}${this._api}`, campaign));
    }

    rename(id: string, rename: string) {
        const renameCampaign = {
            name: rename
        };
        return firstValueFrom(this._http.patch(`${environment.campaign}${this._api}/${id}/rename`, renameCampaign));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete(`${environment.campaign}${this._api}/${id}`));
    }

    private toHttpParams(param?: CampaignParams): HttpParams {
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
