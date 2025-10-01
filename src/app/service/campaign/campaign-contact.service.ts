import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {CampaignContact, CampaignContactParams} from '../../model/Campaign';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CampaignContactService {

    private _api = '/api/v1/contact';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: CampaignContactParams): Observable<Page<CampaignContact>> {
        return this._http.get<Page<CampaignContact>>(`${environment.campaign}${this._api}`, {params: this.toHttpParams(params)});
    }

    private toHttpParams(param?: CampaignContactParams): HttpParams {
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
        if (param?.campaignId) {
            imutebleParams = imutebleParams.append('campaignId', param.campaignId);
        }
        if (param?.status) {
            imutebleParams = imutebleParams.append('status', param.status);
        }

        return imutebleParams;
    }

}
