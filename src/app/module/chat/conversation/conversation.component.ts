import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger20ms} from '@vex/animations/stagger.animation';
import {ChatService} from "../../../service/chat/chat.service";
import {ConversationCache} from "../../../service/chat/conversation.cache";
import {ActivatedRoute} from "@angular/router";
import {ConversationService} from "../../../service/chat/conversation.service";
import {Conversation, Message, SenderType} from "../../../model/chat/conversation";
import {BehaviorSubject, Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {MatMenuTrigger} from '@angular/material/menu';
import {MessageCache} from "../../../service/chat/message.cache";

@Component({
  selector: 'vex-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
})
export class ConversationComponent implements OnInit {

  @ViewChild('msgTextarea') msgTextarea: ElementRef;

  private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  conversation?: Conversation;

  constructor(
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _conversationCache: ConversationCache,
    private _messageCache: MessageCache,
  ) {
  }

  ngOnInit() {
    this.syncSubscribers();
  }

  openDrawer() {
    this._chatService.drawerOpen.next(true);
    this._cd.markForCheck();
  }

  closeDrawer() {
    this._chatService.drawerOpen.next(false);
    this._cd.markForCheck();
  }

  isCustomer(message: Message): boolean {
    return message.senderType === SenderType.CUSTOMER;
  }

  isAgent(message: Message): boolean {
    return message.senderType === SenderType.AGENT;
  }

  isBot(message: Message): boolean {
    return message.senderType === SenderType.BOT;
  }

  onScrollEnd() {
    console.log('onScrollEnd', this.messages$);
  }

  autoResize(textarea: HTMLTextAreaElement) {
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }

  sendMessage(textarea: HTMLTextAreaElement) {
    const value = textarea.value.trim();
    if (!value) return;

    // seu envio aqui
    console.log('enviar:', value);

    // limpar e resetar altura
    textarea.value = '';
    textarea.style.height = 'auto';
    // se você usa change detection ou bind, dispare a atualização conforme necessário
  }

  onSelectEmoji(event, trigger: MatMenuTrigger) {
    const emoji = event?.emoji?.native;
    const textarea: HTMLTextAreaElement = this.msgTextarea?.nativeElement;

    if (!textarea) return;

    const index = textarea.selectionStart;
    const text = textarea.value;

    textarea.value = text.slice(0, index) + emoji + text.slice(index);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = index + emoji.length;
      textarea.focus();
      this.autoResize(textarea);
    });

    trigger?.closeMenu?.();
  }

  private syncSubscribers() {
    this._route
      .paramMap
      .subscribe(params => {
        const id = params.get('conversationId');

        if (!id) return;

        const cached = this._conversationCache.get(id);

        if (cached) {
          this.conversation = cached;
          this.loadMessages();

          this._cd.markForCheck();
        } else {
          this._conversationService
            .findById(id)
            .subscribe(c => {
              this.conversation = c;
              this._conversationCache.set(c);
              this.loadMessages();

              this._cd.markForCheck();
            });
        }
      });
  }

  private loadMessages(datetime?: string) {
    if (this.loading$.value) return;

    this.loading$.next(true);

    this._conversationService.getMessages(this.conversation?.id, datetime)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (messages) => {
          // const current = this.messagesSubject.value;
          // const merged = [...current, ...messages];
          // this.messagesSubject.next(merged);
          this.messagesSubject.next(messages);
        },
        error: (err) => {
          console.error('Error when load messages:', err);
        }
      });
  }

}
