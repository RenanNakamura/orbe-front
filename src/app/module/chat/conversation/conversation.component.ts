import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {stagger20ms} from '@vex/animations/stagger.animation';
import {ChatService} from "../../../service/chat/chat.service";
import {ActivatedRoute} from "@angular/router";
import {ConversationService} from "../../../service/chat/conversation.service";
import {
  Conversation,
  Message,
  MessageStatusColorMap,
  MessageStatusIconMap,
  MessageType,
  SenderType,
  SendMessageRequest
} from "../../../model/chat/conversation";
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

  @ViewChild('textareaMessage') msgTextarea: ElementRef;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  conversation?: Conversation;

  protected readonly MessageStatusIconMap = MessageStatusIconMap;
  protected readonly MessageStatusColorMap = MessageStatusColorMap;

  constructor(
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
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
    if (this.loading$.value) {
      return;
    }

    const conversationId = this.conversation?.id;

    if (!conversationId) {
      return;
    }

    const currentMessages = this.messagesSubject.value;

    if (!currentMessages.length) {
      return;
    }

    const oldestMsg = currentMessages[0];
    const cursor = oldestMsg.createdAt;

    this.loading$.next(true);

    this._conversationService
      .getMessages(conversationId, cursor)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (messages) => {
          messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          this.putMessagesCache(conversationId, messages);
        },
        error: (err) => {
          console.error(`m=onScrollEnd; msg=Error loading more messages; conversationId=${conversationId}`, err);
        }
      });
  }

  autoResize(textarea: HTMLTextAreaElement) {
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }

  sendMessage(textarea: HTMLTextAreaElement) {
    const value = textarea?.value?.trim();

    if (!value) return;

    const request: SendMessageRequest = {
      senderType: SenderType.AGENT,
      senderId: 'd03facc0-cc8a-42a2-9ad5-f0045b583502',
      phoneNumberId: this.conversation.phoneNumberId,
      content: {
        to: `${this.conversation.ddi}${this.conversation.phoneNumber}`,
        type: MessageType.TEXT,
        text: {
          body: value,
          previewUrl: false
        }
      }
    }

    this._conversationService.sendMessage(this.conversation.id, request)
      .pipe(finalize(() => {
        textarea.value = '';
        textarea.style.height = 'auto';
        this.loading$.next(false);
      }))
      .subscribe(messageCreated => {
        console.log('MessageCreated => ', messageCreated);

        this.putMessagesCache(this.conversation.id, [messageCreated]);
      })
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
      .data
      .subscribe((data) => {
        this.conversation = data?.['conversation'] as Conversation;
        this.loadMessages();
      });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  private loadMessages(datetime?: string) {
    const conversationId = this.conversation?.id;

    if (!conversationId) {
      return;
    }

    const cachedMessages = this._messageCache.get(conversationId);

    if (cachedMessages?.length) {
      console.log('cachedMessages', cachedMessages)
      this.messagesSubject.next(cachedMessages);
      this.scrollToBottom();
      return;
    }

    this.loading$.next(true);

    this._conversationService.getMessages(conversationId, datetime)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (messages) => {
          messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          this.messagesSubject.next(messages);
          this._messageCache.setAll(conversationId, messages);

          this.scrollToBottom();
        },
        error: (err) => {
          console.error(`m=loadMessages; msg=Error when load messages; conversationId=${conversationId}`, err);
        }
      });
  }

  private putMessagesCache(conversationId: string, messages: Message[]) {
    const currentMessages = this._messageCache.get(conversationId);
    const combined = [...messages, ...currentMessages];

    this.messagesSubject.next(combined);
    this._messageCache.setAll(conversationId, combined);
  }
}
