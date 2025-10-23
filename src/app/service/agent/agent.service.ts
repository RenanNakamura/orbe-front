import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateAgentRequest, GetAgentResponse, ListAgentResponse, UpdateAgentRequest} from "../../model/chat/agent";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private _api = '/agents';

  constructor(private readonly _http: HttpClient) {
  }

  create(request: CreateAgentRequest): Observable<void> {
    return this._http.post<void>(`${environment.chat}${this._api}`, request);
  }

  update(id: string, request: UpdateAgentRequest): Observable<void> {
    return this._http.patch<void>(`${environment.chat}${this._api}/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this._http.patch<void>(`${environment.chat}${this._api}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this._http.patch<void>(`${environment.chat}${this._api}/${id}/deactivate`, {});
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${environment.chat}${this._api}/${id}`, {});
  }

  list(): Observable<ListAgentResponse[]> {
    return this._http.get<ListAgentResponse[]>(`${environment.chat}${this._api}`);
  }

  get(id: string): Observable<GetAgentResponse> {
    return this._http.get<GetAgentResponse>(`${environment.chat}${this._api}/${id}`);
  }

}
