import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conversation, CreateConversation, Message, SendMessageRequest} from "../../model/chat/conversation";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TokenStorage} from "../../storage/user/token.storage";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _api = '/conversations';

  constructor(
    private readonly _http: HttpClient,
    private readonly _tokenStorage: TokenStorage
  ) {
  }

  list(cursor: string, search?: string, limit: number = 20, limitMessages: number = 1, channelId?: string, phoneNumberId?: string, onlyUnread: boolean = false): Observable<Conversation[]> {
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

    if (onlyUnread) {
      params = params.set('onlyUnread', 'true');
    }

    return this._http.get<Conversation[]>(`${environment.chat}${this._api}`, {
      params,
      headers: {
        'X-Agent-Id': this.getAgentId()
      }
    });

  }

  create(body: CreateConversation): Observable<Conversation> {
    return this._http.post<Conversation>(`${environment.chat}${this._api}`, body);
  }

  findById(id: string): Observable<Conversation> {
    return this._http.get<Conversation>(`${environment.chat}${this._api}/${id}/details`);
  }

  getMessages(id: string, cursor?: string, limit: number = 20): Observable<Message[]> {
    let params = new HttpParams()
      .set('limit', limit.toString());

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    return this._http.get<Message[]>(`${environment.chat}${this._api}/${id}/messages`, {params});
  }

  sendMessage(channelId: string, conversationId: string, request: SendMessageRequest): Observable<Message> {
    return this._http.post<Message>(`${environment.chat}${this._api}/${conversationId}/channels/${channelId}/messages/send`, request);
  }

  archive(conversationId: string): Observable<void> {
    return this._http.patch<void>(`${environment.chat}${this._api}/${conversationId}/archive`, {});

  }

  markAsRead(conversationId: string): Observable<void> {
    return this._http.post<void>(`${environment.chat}${this._api}/${conversationId}/read`, {}, {
      headers: {
        'X-Agent-Id': this.getAgentId()
      }
    });

  }

  private getAgentId(): string {
    const agentId = this._tokenStorage.getClaim('agentId') || this._tokenStorage.getClaim('sub');

    if (!agentId) {
      console.error('m=getAgentId; msg=Agent ID not found in token');
      throw new Error('Agent ID not found in token');

    }

    return agentId;

  }

}
