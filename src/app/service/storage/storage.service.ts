import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '../sk/alert.service';
import {FileUtil} from '../../util/file.util';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private _api = '/api/v1/storage';

    constructor(private readonly _http: HttpClient,
                private _translate: TranslateService,
                private _alert: AlertService) {
    }

    upload(file: File): Promise<{ filename: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return firstValueFrom(this._http.post<{ filename: string }>(`${environment.storage}${this._api}`, formData));
    }

    download(fileName: string): Observable<Blob> {
        return this._http.get(`${environment.storage}${this._api}/${fileName}`, {responseType: 'blob'});
    }

    delete(fileName: string): Observable<void> {
        return this._http.delete<void>(`${environment.storage}${this._api}/${fileName}`);
    }

    getSharedUrl(fileName: string): Promise<SharedUrlResponse> {
        return firstValueFrom(this._http.get<SharedUrlResponse>(`${environment.storage}${this._api}/${encodeURIComponent(fileName)}/url`));
    }

    async validateFile(file: File, type: string): Promise<void> {
        const validation = FileUtil.validateFile(file, type);

        if (!validation.success && validation?.error === 'TYPE_NOT_IMPLEMENTED') {
            const parameters = {type};
            const message = this._translate.instant('file.validation.type-not-implemented', parameters);

            await this._alert.error(message);
            throw new Error(message);
        }

        if (!validation.success && validation?.error === 'MAX_SIZE_EXCEEDED') {
            const mediaValidation = FileUtil.getMediaValidation(type);
            const parameters = {type, maxSize: (mediaValidation?.maxSize / (1024 * 1024))};
            const message = this._translate.instant('file.validation.max-size', parameters);

            await this._alert.error(message);
            throw new Error(message);
        }

        if (!validation.success && validation?.error === 'MIME_TYPE_NOT_ACCEPTED') {
            const mediaValidation = FileUtil.getMediaValidation(type);
            const parameters = {
                type,
                mimeTypes: mediaValidation.mimeTypes.join(', ')
            };
            const message = this._translate.instant('file.validation.mime-type', parameters);

            await this._alert.error(message);
            throw new Error(message);
        }
    }

}

interface SharedUrlResponse {
    url: string;
}
