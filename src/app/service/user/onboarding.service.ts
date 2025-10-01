import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FinishOnboarding, Onboarding} from '../../model/User';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {

    private _api = '/api/v1/onboarding';

    constructor(private readonly _http: HttpClient) {
    }

    get(id: string, token: string): Observable<Onboarding> {
        return this._http.get<Onboarding>(`${environment.buddy}${this._api}/${id}?token=${token}`);
    }

    finish(id: string, token: string, recaptchaToken: string, finishOnboarding: FinishOnboarding) {
        const headers = new HttpHeaders({
            'g-recaptcha-response': recaptchaToken
        });
        return this._http.post(`${environment.buddy}${this._api}/${id}/${token}/finish`, finishOnboarding, {headers});
    }

}
