import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat.component';
import {ConversationComponent} from "./conversation/conversation.component";
import {ConversationEmptyComponent} from "./conversation-empty/conversation-empty.component";
import {ConversationResolver} from "./resolver/conversation.resolver";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: false,
      footerVisible: false
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ConversationEmptyComponent
      },
      {
        path: ':conversationId',
        component: ConversationComponent,
        resolve: {
          conversation: ConversationResolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
}
