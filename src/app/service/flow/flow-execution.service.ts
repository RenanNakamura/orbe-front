import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {environment} from '../../../environments/environment';
import {FlowExecution, FlowParams} from '../../model/flow/Flow';

@Injectable({
    providedIn: 'root'
})
export class FlowExecutionService {

    private _api = '/api/v1/flow-execution';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: FlowParams): Observable<Page<FlowExecution>> {
        return this._http.get<Page<FlowExecution>>(`${environment.flow}${this._api}`, {params: this.toHttpParams(params)});
    }

    get(id: string): Observable<FlowExecution> {
        return this._http.get<FlowExecution>(`${environment.flow}${this._api}/${id}`);
    }

    interrupt(id: string): Observable<void> {
        return this._http.patch<void>(`${environment.flow}${this._api}/${id}/interrupt`, {});
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
        if (param?.flowId) {
            imutebleParams = imutebleParams.append('flowId', param.flowId);
        }

        return imutebleParams;
    }

}
