import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Conversation} from "../../../model/chat/conversation";
import {ConversationService} from "../../../service/chat/conversation.service";
import {ConversationCache} from "../../../service/chat/conversation.cache";

@Injectable({
  providedIn: 'root'
})
export class ConversationResolver implements Resolve<Conversation> {

  constructor(private readonly _service: ConversationService,
              private _conversationCache: ConversationCache) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Conversation> | Promise<Conversation> | Conversation {
    const id = route.paramMap.get('conversationId');
    const conversationCached = this._conversationCache.get(id);

    if (conversationCached) {
      return conversationCached;
    }

    return this._service.findById(id)
      .pipe(
        tap(conversation => {
          this._conversationCache.set(conversation);
        })
      );
  }

}
