import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {CreateAgentRequest, GetAgentResponse, ListAgentResponse, UpdateAgentRequest} from "../../model/chat/agent";
import {environment} from "../../../environments/environment";
import {Language} from "../../model/sk/Language";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private _api = '/agents';

  constructor(private readonly _http: HttpClient) {
  }

  create(request: CreateAgentRequest): Observable<void> {
    return this._http.post<void>(`${environment.buddy}${this._api}`, request);
  }

  resendEmail(id: string): Observable<void> {
    return this._http.post<void>(`${environment.buddy}${this._api}/${id}/resend-email`, {});
  }

  update(id: string, request: UpdateAgentRequest): Observable<void> {
    return this._http.patch<void>(`${environment.buddy}${this._api}/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this._http.patch<void>(`${environment.buddy}${this._api}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this._http.patch<void>(`${environment.buddy}${this._api}/${id}/deactivate`, {});
  }

  changeLanguage(changeLanguage: { language: Language }) {
    return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/change-language`, changeLanguage));
  }

  changePassword(changePassword: { currentPassword: string, newPassword: string }) {
    return firstValueFrom(this._http.patch(`${environment.buddy}${this._api}/change-password`, changePassword));
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${environment.buddy}${this._api}/${id}`, {});
  }

  list(): Observable<ListAgentResponse[]> {
    return this._http.get<ListAgentResponse[]>(`${environment.buddy}${this._api}`);
  }

  get(id: string): Observable<GetAgentResponse> {
    return this._http.get<GetAgentResponse>(`${environment.buddy}${this._api}/${id}`);
  }

}
