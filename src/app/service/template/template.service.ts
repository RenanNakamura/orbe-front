import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../../model/sk/Page';
import {Template, TemplateParams} from '../../model/Template';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    private _api = '/api/v1/template';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: TemplateParams): Observable<Page<Template>> {
        return this._http.get<Page<Template>>(`${environment.buddy}${this._api}`, {params: this.toHttpParams(params)});
    }

    create(template: Template, file: File = null) {
        const formData = new FormData();
        formData.append('create-template', new Blob([JSON.stringify(template)], { type: 'application/json' }));
        if (file != null) {
            formData.append('file', file);
        }

        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}`, formData));
    }

    update(template: Template, file: File = null) {
        const formData = new FormData();
        formData.append('update-template', new Blob([JSON.stringify(template)], { type: 'application/json' }));
        if (file != null) {
            formData.append('file', file);
        }

        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${template.id}`, formData));
    }

    delete(id: string) {
        return firstValueFrom(this._http.delete(`${environment.buddy}${this._api}/${id}`));
    }

    get(id: string): Observable<Template> {
        return this._http.get<Template>(`${environment.buddy}${this._api}/${id}`);
    }

    sync() {
        return this._http.patch(`${environment.buddy}${this._api}/sync`, {});
    }

    private toHttpParams(param?: TemplateParams): HttpParams {
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
        if (param?.name) {
            imutebleParams = imutebleParams.append('name', param.name);
        }
        if (param?.status) {
            imutebleParams = imutebleParams.append('status', param.status);
        }
        if (param?.channelId) {
            imutebleParams = imutebleParams.append('channelId', param.channelId);
        }

        return imutebleParams;
    }

}
