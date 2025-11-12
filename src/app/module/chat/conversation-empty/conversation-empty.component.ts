import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from '@vex/animations/scale-fade-in.animation';
import {ChatService} from "../../../service/chat/chat.service";

@Component({
  selector: 'vex-conversation-empty',
  templateUrl: './conversation-empty.component.html',
  styleUrls: ['./conversation-empty.component.scss'],
  animations: [scaleFadeIn400ms],
})
export class ConversationEmptyComponent implements OnInit {

  constructor(
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService
  ) {
  }

  ngOnInit() {
  }

  openDrawer() {
    this._chatService.drawerOpen.next(true);
    this._cd.markForCheck();
  }

  closeDrawer() {
    this._chatService.drawerOpen.next(false);
    this._cd.markForCheck();
  }
}
