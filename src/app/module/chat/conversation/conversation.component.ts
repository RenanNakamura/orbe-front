import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
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
import {BehaviorSubject, combineLatest, fromEvent, Observable, Subject} from "rxjs";
import {debounceTime, filter, finalize, map} from "rxjs/operators";
import {MatMenuTrigger} from '@angular/material/menu';
import {MessageCache} from "../../../service/chat/message.cache";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'vex-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
})
export class ConversationComponent implements OnInit, AfterViewInit {

  @ViewChild('textareaMessage') msgTextarea: ElementRef;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  public stickToBottom$ = new BehaviorSubject<boolean>(true);
  private mediaLoaded$ = new Subject<void>();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  conversation?: Conversation;

  protected readonly MessageType = MessageType;
  protected readonly MessageStatusIconMap = MessageStatusIconMap;
  protected readonly MessageStatusColorMap = MessageStatusColorMap;

  private destroyRef = inject(DestroyRef);

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

  ngAfterViewInit() {
    this.setupScrollListener();
    this.setupAutoScrollOnMediaLoaded();
  }

  /**
   * Detecta scroll e atualiza stickToBottom$
   */
  private setupScrollListener() {
    if (!this.messagesContainer?.nativeElement) return;

    fromEvent(this.messagesContainer.nativeElement, 'scroll')
      .pipe(
        debounceTime(10),
        map(() => {
          const el = this.messagesContainer.nativeElement as HTMLElement;
          return Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(atBottom => this.stickToBottom$.next(atBottom));
  }

  /**
   * Sempre que mídia carregar E o usuário estiver no final → rolar automaticamente
   */
  private setupAutoScrollOnMediaLoaded() {
    combineLatest([
      this.mediaLoaded$.pipe(debounceTime(30)),
      this.stickToBottom$
    ])
      .pipe(
        filter(([_, stick]) => stick),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.scrollToBottom());
  }

  openDrawer() {
    this._chatService.drawerOpen.next(true);
    this._cd.markForCheck();
  }

  closeDrawer() {
    this._chatService.drawerOpen.next(false);
    this._cd.markForCheck();
  }

  isCustomer(m: Message) {
    return m.senderType === SenderType.CUSTOMER;
  }

  isAgent(m: Message) {
    return m.senderType === SenderType.AGENT;
  }

  isBot(m: Message) {
    return m.senderType === SenderType.BOT;
  }

  onScrollEnd() {
    if (this.loading$.value) return;

    const conversationId = this.conversation?.id;
    if (!conversationId) return;

    const currentMessages = this.messagesSubject.value;
    if (!currentMessages.length) return;

    const oldestMsg = currentMessages[0];
    const cursor = oldestMsg.createdAt;

    this.loading$.next(true);

    this._conversationService.getMessages(conversationId, cursor)
      .pipe(
        finalize(() => this.loading$.next(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (messages) => this.putMessagesCache(conversationId, messages),
        error: (err) => console.error(`m=onScrollEnd; msg=Error loading more messages`, err)
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
        text: {body: value, previewUrl: false}
      }
    }

    this._conversationService.sendMessage(this.conversation.id, request)
      .pipe(
        finalize(() => {
          textarea.value = '';
          textarea.style.height = 'auto';
          if (this.stickToBottom$.value) {
            this.scrollToBottom();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(messageCreated => {
        this.putMessagesCache(this.conversation.id, [messageCreated]);
        this._chatService.messageSent.next({
          conversationId: this.conversation.id,
          message: messageCreated
        });
      });
  }

  onSelectEmoji(event, trigger: MatMenuTrigger) {
    const emoji = event?.emoji?.native;
    const textarea = this.msgTextarea?.nativeElement as HTMLTextAreaElement;
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

  onMediaLoaded() {
    this.mediaLoaded$.next();
  }

  private syncSubscribers() {
    this._route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.conversation = data['conversation'] as Conversation;
        this.loadMessages();
      });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }

  private loadMessages(datetime?: string) {
    const conversationId = this.conversation?.id;
    if (!conversationId) return;

    const cachedMessages = this._messageCache.get(conversationId);
    if (cachedMessages?.length) {
      this.messagesSubject.next(cachedMessages);
      this.scrollToBottom();
      return;
    }

    this.loading$.next(true);

    this._conversationService.getMessages(conversationId, datetime)
      .pipe(
        finalize(() => this.loading$.next(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: messages => {
          messages.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          this.messagesSubject.next(messages);
          this._messageCache.setAll(conversationId, messages);
          this.scrollToBottom();
        },
        error: err =>
          console.error(`m=loadMessages; msg=Error loading messages`, err)
      });
  }

  private putMessagesCache(conversationId: string, messages: Message[]) {
    const currentMessages = this._messageCache.get(conversationId) ?? [];
    const combined = [...messages, ...currentMessages];

    combined.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    this.messagesSubject.next(combined);
    this._messageCache.setAll(conversationId, combined);
  }

}
