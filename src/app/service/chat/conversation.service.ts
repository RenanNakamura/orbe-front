import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conversation, CreateConversation, Message} from "../../model/chat/conversation";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _api = '/conversations';

  constructor(private readonly _http: HttpClient) {
  }

  list(cursor: string, search?: string, limit: number = 20, limitMessages: number = 1, channelId?: string, phoneNumberId?: string): Observable<Conversation[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('limitMessages', limitMessages.toString());

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    if (search) {
      params = params.set('search', search);
    }

    if (channelId) {
      params = params.set('channelId', channelId);
    }

    if (phoneNumberId) {
      params = params.set('phoneNumberId', phoneNumberId);
    }

    return this._http.get<Conversation[]>(`${environment.chat}${this._api}`, {params});
  }

  create(body: CreateConversation): Observable<Conversation> {
    return this._http.post<Conversation>(`${environment.chat}${this._api}`, body);
  }

  findById(id: string): Observable<Conversation> {
    return this._http.get<Conversation>(`${environment.chat}${this._api}/${id}/details`);
  }

  getMessages(id: string, cursor: string, limit: number = 10): Observable<Message[]> {
    let params = new HttpParams()
      .set('limit', limit.toString());

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    return this._http.get<Message[]>(`${environment.chat}${this._api}/${id}/messages`, {params});
  }
}
