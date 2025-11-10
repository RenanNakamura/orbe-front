import {NgModule} from '@angular/core';
import {ChatComponent} from './chat.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ChatRoutingModule} from "./chat-routing.module";
import {MatMenuModule} from "@angular/material/menu";
import {VexScrollbarComponent} from "@vex/components/vex-scrollbar/vex-scrollbar.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {ConversationComponent} from "./conversation/conversation.component";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatFormField, MatPrefix} from "@angular/material/form-field";
import {MatRipple} from "@angular/material/core";
import {MatInput} from "@angular/material/input";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ChatComponent,
    ConversationComponent,
  ],
  imports: [
    ChatRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    VexScrollbarComponent,
    ReactiveFormsModule,
    MatDividerModule,
    MatDrawerContent,
    MatDrawer,
    MatDrawerContainer,
    AsyncPipe,
    MatFormField,
    CommonModule,
    MatRipple,
    MatInput,
    TranslateModule,
    MatPrefix,
  ],
  providers: []
})
export class ChatModule {
}
