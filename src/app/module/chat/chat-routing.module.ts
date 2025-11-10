import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat.component';
import {ConversationComponent} from "./conversation/conversation.component";

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
        component: ConversationComponent
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
