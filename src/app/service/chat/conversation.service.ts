import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conversation} from "../../model/chat/conversation";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _api = '/conversations';

  constructor(private readonly _http: HttpClient) {
  }

  list(): Observable<Conversation[]> {
    return this._http.get<Conversation[]>(`${environment.chat}${this._api}`);
  }

}
