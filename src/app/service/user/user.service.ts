import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {LoggedUser, User, UserParams} from '../../model/User';
import {Page} from '../../model/sk/Page';
import {environment} from '../../../environments/environment';
import {Language} from '../../model/sk/Language';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private _api = '/api/v1/user';

    constructor(private readonly _http: HttpClient) {
    }

    list(params: UserParams): Observable<Page<User>> {
        return this._http.get<Page<User>>(`${environment.buddy}${this._api}`, {params: this.toHttpParams(params)});
    }

    create(user: User) {
        return firstValueFrom(this._http.post(`${environment.buddy}${this._api}`, user));
    }

    update(user: User) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${user.id}`, user));
    }

    activate(id: string) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${id}/activate`, {}));
    }

    inactivate(id: string) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/${id}/inactivate`, {}));
    }

    login(token: string, login: { email: string, password: string }): Observable<HttpResponse<LoggedUser>> {
        const headers = new HttpHeaders({
            'g-recaptcha-response': token
        });

        return this._http.post<LoggedUser>(`${environment.buddy}${this._api}/login`, login, {
            headers,
            observe: 'response'
        });
    }

    refreshToken(token: string): Observable<HttpResponse<void>> {
        return this._http.post<void>(
            `${environment.buddy}${this._api}/refresh-token`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                observe: 'response'
            }
        );
    }

    personalData(): Observable<HttpResponse<User>> {
        return this._http.get<User>(`${environment.buddy}${this._api}/personal-data`, {observe: 'response'});
    }

    changePassword(changePassword: { currentPassword: string, newPassword: string }) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/change-password`, changePassword));
    }

    changeLanguage(changeLanguage: { language: Language }) {
        return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/change-language`, changeLanguage));
    }

    recoverPassword(token: string, recoverPassword: { email: string }) {
        const headers = new HttpHeaders({
            'g-recaptcha-response': token
        });

        return this._http.post(`${environment.buddy}${this._api}/recover-password`, recoverPassword, {headers});
    }

    recoverPasswordUser(token: string, recoverPassword: { email: string, token: string, recoverPasswordId: string, newPassword: string }) {
        const headers = new HttpHeaders({
            'g-recaptcha-response': token
        });

        return this._http.patch(`${environment.buddy}${this._api}/recover-password/change-password`, recoverPassword, {headers});
    }

    private toHttpParams(param?: UserParams): HttpParams {
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
