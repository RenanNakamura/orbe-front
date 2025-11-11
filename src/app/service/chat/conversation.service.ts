import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conversation} from "../../model/chat/conversation";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _api = '/conversations';

  constructor(private readonly _http: HttpClient) {
  }

  list(cursor: string, limit: number = 20, limitMessages: number = 1): Observable<Conversation[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('limitMessages', limitMessages.toString());

    if (cursor) {
      params = params.set('cursor', cursor);
    }
    return this._http.get<Conversation[]>(`${environment.chat}${this._api}`, {params});
  }

}
