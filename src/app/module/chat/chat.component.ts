import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from "@vex/animations/scale-fade-in.animation";
import {BehaviorSubject, Observable, Subject, switchMap} from "rxjs";
import {Conversation, ConversationChannel, ConversationStatus, CreateConversation} from "../../model/chat/conversation";
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

  loading$ = new BehaviorSubject<boolean>(false);

  searchCtrl = new UntypedFormControl();
  contactSearchCtrl = new UntypedFormControl();
  channels: Channel[] = [];

  mobileQuery$ = this._layoutService.ltMd$;
  drawerOpen$ = this._chatService.drawerOpen$;

  private contactsTotal = 0;
  private contactsNextPage = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _layoutService: VexLayoutService,
    private _channelService: ChannelService,
    private _contactService: ContactService,
  ) {
  }

  ngOnInit() {
    this.syncSubscribers();
    this.loadChannels();
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
          console.error('Error when creating conversation:', err);
        }
      });
  }

  onChannelSelect(channel: Channel | null) {
    this.selectedChannelSubject.next(channel);
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

    // this._route
    //   .firstChild
    //   ?.data
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     console.log('chat.data => ', data);
    //     const conversation = data?.['conversation'] as Conversation;
    //
    //     if (conversation) {
    //       console.log('entrou', this.channels);
    //       const channelOfConversation = this.channels.find(
    //         c => c.id === conversation.channelId
    //       );
    //
    //       console.log('channelOfConversation');
    //
    //       if (channelOfConversation) {
    //         this.selectedChannelSubject.next(channelOfConversation);
    //       }
    //     }
    //   });
  }

  private loadChannels() {
    this._channelService.list({sort: 'createdDate,desc'})
      .subscribe({
        next: (page) => {
          this.channels = page.content || [];

          if (this.channels?.length && !this.selectedChannelSubject?.value) {
            this.onChannelSelect(this.channels[0]);
          }
        },
        error: (err) => {
          console.error('Error when load channels:', err);
        }
      });
  }

  private loadConversations(datetime?: string) {
    if (this.loading$.value) return;

    this.loading$.next(true);

    const selectedChannel = this.selectedChannelSubject.value;
    const channelId = selectedChannel?.id;
    const phoneNumberId = selectedChannel?.phoneNumberId;

    this._conversationService.list(datetime, this.searchCtrl?.value || '', 20, 1, channelId, phoneNumberId)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (conversations) => {
          const current = this.conversationsSubject.value;
          const merged = [...current, ...conversations];
          this.conversationsSubject.next(merged);
        },
        error: (err) => {
          console.error('Error when load conversations:', err);
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
          console.error('Error when load contacts:', err);
        }
      });
  }

  private resetContacts() {
    this.contactsSubject.next([]);
    this.contactsTotal = 0;
    this.contactsNextPage = 0;
  }

}
