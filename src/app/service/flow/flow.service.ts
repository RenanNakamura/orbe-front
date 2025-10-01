import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {environment} from '../../../environments/environment';
import {CreateFlow, Flow, FlowParams, UpdateFlow, UpdateFlowNodes} from '../../model/flow/Flow';

@Injectable({
    providedIn: 'root'
})
export class FlowService {

    private _api = '/api/v1/flow';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: FlowParams): Observable<Page<Flow>> {
        return this._http.get<Page<Flow>>(`${environment.flow}${this._api}`, {params: this.toHttpParams(params)});
    }

    get(id: string): Observable<Flow> {
        return this._http.get<Flow>(`${environment.flow}${this._api}/${id}`);
    }

    create(input: CreateFlow) {
        return firstValueFrom(this._http.post(`${environment.flow}${this._api}`, input));
    }

    update(id: string, input: UpdateFlow) {
        return firstValueFrom(this._http.patch(`${environment.flow}${this._api}/${id}`, input));
    }

    active(id: string) {
        return firstValueFrom(this._http.patch(`${environment.flow}${this._api}/${id}/active`, {}));
    }

    inactive(id: string) {
        return firstValueFrom(this._http.patch(`${environment.flow}${this._api}/${id}/inactive`, {}));
    }

    updateNodes(id: string, flow: UpdateFlowNodes) {
        return firstValueFrom(this._http.patch(`${environment.flow}${this._api}/${id}/node`, flow));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete(`${environment.flow}${this._api}/${id}`));
    }

    private toHttpParams(param?: FlowParams): HttpParams {
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
