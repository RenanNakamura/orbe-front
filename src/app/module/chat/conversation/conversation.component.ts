import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {FormControl, FormGroup} from '@angular/forms';
import {stagger20ms} from '@vex/animations/stagger.animation';
import {VexScrollbarComponent} from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import {ChatService} from "../../../service/chat/chat.service";
import {ConversationCache} from "../../../service/chat/conversation.cache";
import {ActivatedRoute} from "@angular/router";
import {ConversationService} from "../../../service/chat/conversation.service";
import {Conversation} from "../../../model/chat/conversation";

@Component({
  selector: 'vex-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
})
export class ConversationComponent implements OnInit {

  conversation?: Conversation;
  // messages!: ChatMessage[];

  form = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  constructor(
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _conversationCache: ConversationCache,
  ) {
  }

  ngOnInit() {
    this._route
      .paramMap
      .subscribe(params => {
        const id = params.get('conversationId');

        if (!id) return;

        const cached = this._conversationCache.get(id);

        console.log('Conversation cached => ', cached);

        if (cached) {
          this.conversation = cached;
          this._cd.markForCheck();
        } else {
          this._conversationService
            .findById(id)
            .subscribe(c => {
              console.log('Conversation resulted => ', c);
              this.conversation = c;
              this._conversationCache.set(c);
              this._cd.markForCheck();
            });
        }
      });
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
