import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private _api = '/api/v1/billing';

  constructor(private readonly _http: HttpClient) {
  }

  manager(): Observable<{ url: string }> {
    return this._http.get<{ url: string }>(`${environment.buddy}${this._api}/manager`);
  }

}
