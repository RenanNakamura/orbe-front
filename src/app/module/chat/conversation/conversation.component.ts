import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {FormControl, FormGroup} from '@angular/forms';
import {stagger20ms} from '@vex/animations/stagger.animation';
import {VexScrollbarComponent} from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import {ChatService} from "../../../service/chat/chat.service";

@Component({
  selector: 'vex-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
})
export class ConversationComponent implements OnInit {

  conversation?: any;
  // messages!: ChatMessage[];

  form = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  constructor(
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
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
