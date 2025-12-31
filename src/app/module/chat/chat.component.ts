import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from "@vex/animations/scale-fade-in.animation";
import {BehaviorSubject, Observable, Subject, switchMap} from "rxjs";
import {
  Conversation,
  ConversationChannel,
  ConversationStatus,
  CreateConversation,
  Message
} from "../../model/chat/conversation";
import {ChatService} from "../../service/chat/chat.service";
import {VexLayoutService} from "@vex/services/vex-layout.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {debounceTime, filter, finalize, startWith, takeUntil} from "rxjs/operators";
import {ConversationService} from "../../service/chat/conversation.service";
import {UntypedFormControl} from "@angular/forms";
import {Channel} from "../../model/Channel";
import {ChannelService} from "../../service/channel/channel.service";
import {Contact} from "../../model/Contact";
import {ContactService} from "../../service/contact/contact.service";
import {MessageCache} from "../../service/chat/message.cache";
import {ChatWebSocketService} from "../../service/chat/chat-websocket.service";
import {WebSocketStatus} from "../../service/websocket/websocket-connection";

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [scaleFadeIn400ms],
})
export class ChatComponent implements OnInit, OnDestroy {

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$: Observable<Conversation[]> = this.conversationsSubject.asObservable();

  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  selectedChannel$: Observable<Channel | null> = this.selectedChannelSubject.asObservable();

  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();

  private contactsLoadingSubject = new BehaviorSubject<boolean>(false);
  contactsLoading$ = this.contactsLoadingSubject.asObservable();

  private creatingConversationSubject = new BehaviorSubject<boolean>(false);
  creatingConversation$ = this.creatingConversationSubject.asObservable();

  private isCreatingConversationSubject = new BehaviorSubject<boolean>(false);
  isCreatingConversation$ = this.isCreatingConversationSubject.asObservable();

  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  channels$ = this.channelsSubject.asObservable();

  loading$ = new BehaviorSubject<boolean>(false);

  searchCtrl = new UntypedFormControl();
  contactSearchCtrl = new UntypedFormControl();

  mobileQuery$ = this._layoutService.ltMd$;
  drawerOpen$ = this._chatService.drawerOpen$;

  private contactsTotal = 0;
  private contactsNextPage = 0;
  private destroy$ = new Subject<void>();

  selectedConversationId: string | null = null;
  conversationMenuOpenedId: string | null = null;

  wsStatus$ = this._chatWebSocket.status$;
  protected readonly WebSocketStatus = WebSocketStatus;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _layoutService: VexLayoutService,
    private _channelService: ChannelService,
    private _contactService: ContactService,
    private _messageCache: MessageCache,
    private _chatWebSocket: ChatWebSocketService
  ) {
  }

  ngOnInit() {
    this.syncSubscribers();
    this.loadChannels();
    this.subscribeWebsocketEvents();
  }

  private subscribeWebsocketEvents() {
    this._chatService.messageReceived$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.handleNewMessageEvent(event);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drawerChange(drawerOpen: boolean) {
    this._chatService.drawerOpen.next(drawerOpen);
  }

  openDrawer() {
    this._chatService.drawerOpen.next(true);
    this._cd.markForCheck();
  }

  closeDrawer() {
    this._chatService.drawerOpen.next(false);
    this._cd.markForCheck();
  }

  onScrollEnd(): void {
    if (this.isCreatingConversationSubject.value) {
      this.loadContacts();
    } else {
      const datetime = this.getLastConversationDate();
      this.loadConversations(datetime);
    }
  }

  onAddNewConversation() {
    this.isCreatingConversationSubject.next(true);
    this.contactSearchCtrl.setValue('', {emitEvent: false});
    this.loadContacts(true);
  }

  onCancelNewConversation() {
    this.isCreatingConversationSubject.next(false);
    this.contactSearchCtrl.setValue('', {emitEvent: false});
    this.resetContacts();
  }

  onSelectContact(contact: Contact) {
    if (!contact?.id || this.creatingConversationSubject.value) {
      return;
    }

    this.creatingConversationSubject.next(true);

    const selectedChannel = this.selectedChannelSubject.value;

    const request: CreateConversation = {
      channelId: selectedChannel?.id,
      phoneNumberId: selectedChannel.phoneNumberId,
      name: contact.name,
      ddi: contact.ddi,
      phoneNumber: contact.number,
      status: ConversationStatus.OPEN,
      channel: ConversationChannel.WHATSAPP
    }

    this._conversationService.create(request)
      .pipe(finalize(() => this.creatingConversationSubject.next(false)))
      .subscribe({
        next: (conversation) => {
          this.isCreatingConversationSubject.next(false);
          this.contactSearchCtrl.setValue('', {emitEvent: false});
          this.resetContacts();

          this.conversationsSubject.next([]);
          this.loadConversations();

          if (conversation?.id) {
            this._router.navigate([conversation.id], {relativeTo: this._route});
          }
        },
        error: (err) => {
          console.error('m=onSelectContact; msg=Error when creating conversation', err);
        }
      });
  }

  onChannelSelect(channel: Channel | null) {
    this.selectedChannelSubject.next(channel);
  }

  onArchiveConversation(conversationId: string) {
    if (!conversationId) {
      return;
    }

    this._conversationService.archive(conversationId)
      .subscribe({
        next: () => {
          const current = this.conversationsSubject.value;
          const filtered = current.filter(c => c.id !== conversationId);
          this.conversationsSubject.next(filtered);

          const currentRoute = this._route.firstChild?.snapshot;
          const currentConversationId = currentRoute?.params['conversationId'];

          if (currentConversationId === conversationId) {
            this._router.navigate(['./'], {relativeTo: this._route});
          }
        },
        error: (err) => {
          console.error('m=onArchiveConversation; msg=Error when archiving conversation', err);
        }
      });
  }

  isWhatsAppChannel(channel: Channel | null): boolean {
    return !!channel?.wabaId;
  }

  private syncSubscribers() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => isMobile),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.closeDrawer());

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => !isMobile),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.openDrawer());

    this.mobileQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
        if (isMobile) {
          this._chatService.drawerOpen.next(false);
        } else {
          this._chatService.drawerOpen.next(true);
        }
      });

    this.searchCtrl
      .valueChanges
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe(() => {
        this.conversationsSubject.next([]);
        this.loadConversations();
      });

    this.selectedChannelSubject
      .pipe(
        filter(channel => !!channel),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.conversationsSubject.next([]);
        this.loadConversations();
      });

    this.contactSearchCtrl
      .valueChanges
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isCreatingConversationSubject.value) {
          this.loadContacts(true);
        }
      });

    this._chatService.messageSent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.moveConversationToTop(event.conversationId, event.message);
      });

    const initialConversationId = this._route.firstChild?.snapshot.paramMap.get('conversationId');

    if (initialConversationId) {
      this.selectedConversationId = initialConversationId;
      this.markConversationAsRead(initialConversationId);
    }

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const child = this._route.firstChild;

        if (!child) return;

        const id = child.snapshot.paramMap.get('conversationId');

        if (!id || this.selectedConversationId === id) return;

        this.selectedConversationId = id;
        this.markConversationAsRead(id);
      });
  }

  private markConversationAsRead(conversationId: string) {
    this._conversationService.markAsRead(conversationId)
      .subscribe(() => {
        setTimeout(() => this.updateLocalUnreadCount(conversationId, 0), 1);
      });
  }

  private updateLocalUnreadCount(conversationId: string, count: number) {
    const current = this.conversationsSubject.value;
    const index = current.findIndex(c => c.id === conversationId);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = {...updated[index], unreadCount: count};
      this.conversationsSubject.next(updated);
    }
  }

  private loadChannels() {
    this._channelService.list({sort: 'createdDate,desc'})
      .subscribe({
        next: (page) => {
          const channels = page.content || [];
          this.channelsSubject.next(channels);

          if (channels.length && !this.selectedChannelSubject.value) {
            this.onChannelSelect(channels[0]);
          }
        },
        error: (err) => {
          console.error('m=loadChannels; msg=Error when load channels', err);
        }
      });
  }

  filterType: 'all' | 'unread' = 'all';

  setFilterType(type: 'all' | 'unread') {
    if (this.filterType === type) return;
    this.filterType = type;
    this.conversationsSubject.next([]);
    this.loadConversations();
  }

  private loadConversations(datetime?: string) {
    if (this.loading$.value) return;

    this.loading$.next(true);

    const selectedChannel = this.selectedChannelSubject.value;
    const channelId = selectedChannel?.id;
    const phoneNumberId = selectedChannel?.phoneNumberId;
    const onlyUnread = this.filterType === 'unread';

    this._conversationService.list(datetime, this.searchCtrl?.value || '', 20, 1, channelId, phoneNumberId, onlyUnread)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (conversations) => {
          const current = this.conversationsSubject.value;
          const merged = [...current, ...conversations];
          this.conversationsSubject.next(merged);
        },
        error: (err) => {
          console.error('m=loadConversations; msg=Error when load conversations', err);
        }
      });
  }

  private getLastConversationDate(): string | undefined {
    const conversations = this.conversationsSubject.value;
    if (!conversations.length) return undefined;

    const lastConversation = conversations[conversations.length - 1];
    return lastConversation?.lastMessageAt;
  }

  private loadContacts(reset = false) {
    if (this.contactsLoadingSubject.value) {
      return;
    }

    if (reset) {
      this.resetContacts();
    } else if (this.contactsNextPage !== 0 && (!this.contactsTotal || this.contactsSubject.value.length >= this.contactsTotal)) {
      return;
    }

    const params = {
      page: this.contactsNextPage,
      size: 20,
      sort: 'name,asc',
      search: this.contactSearchCtrl?.value || ''
    };

    this.contactsLoadingSubject.next(true);
    this._contactService.list(params)
      .pipe(finalize(() => this.contactsLoadingSubject.next(false)))
      .subscribe({
        next: (page) => {
          const content = page?.content || [];
          const total = typeof page?.totalElements === 'number' ? page.totalElements : this.contactsTotal;
          const current = this.contactsSubject.value;
          const merged = [...current, ...content];

          this.contactsSubject.next(merged);

          this.contactsTotal = total || 0;
          this.contactsNextPage += 1;
        },
        error: (err) => {
          console.error('m=loadContacts; msg=Error when load contacts', err);
        }
      });
  }

  private resetContacts() {
    this.contactsSubject.next([]);
    this.contactsTotal = 0;
    this.contactsNextPage = 0;
  }

  private moveConversationToTop(conversationId: string, message: Message, incrementUnread: boolean = false): boolean {
    const current = this.conversationsSubject.value;
    const conversationIndex = current.findIndex(c => c.id === conversationId);

    if (conversationIndex === -1) {
      return false;
    }

    const conversation = current[conversationIndex];
    const updatedMessages = [message, ...(conversation.messages || [])];
    const newUnreadCount = incrementUnread ? (conversation.unreadCount || 0) + 1 : conversation.unreadCount;

    const updatedConversation = {
      ...conversation,
      lastMessageAt: message.createdAt,
      messages: updatedMessages,
      unreadCount: newUnreadCount
    };
    const updated = [updatedConversation, ...current.filter(c => c.id !== conversationId)];

    this.conversationsSubject.next(updated);
    return true;
  }

  private handleNewMessageEvent(event: any) {
    const message = event.message;
    const conversationId = event.conversationId;

    const isOpenConversation = conversationId === this.selectedConversationId;

    const moved = this.moveConversationToTop(
      conversationId,
      message,
      !isOpenConversation // só incrementa unread se NÃO estiver aberta
    );

    if (isOpenConversation) {
      this.updateLocalUnreadCount(conversationId, 0);
      this.markConversationAsRead(conversationId);
    }

    if (!moved) {
      this._conversationService.findById(conversationId)
        .subscribe(conversation => {
          const currentConversations = this.conversationsSubject.value ?? [];
          this.conversationsSubject.next([conversation, ...currentConversations]);
        });
    }
  }

}
