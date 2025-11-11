import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from "@vex/animations/scale-fade-in.animation";
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {Conversation} from "../../model/chat/conversation";
import {ChatService} from "../../service/chat/chat.service";
import {VexLayoutService} from "@vex/services/vex-layout.service";
import {NavigationEnd, Router} from "@angular/router";
import {debounceTime, filter, startWith} from "rxjs/operators";
import {ConversationService} from "../../service/chat/conversation.service";
import {UntypedFormControl} from "@angular/forms";

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [scaleFadeIn400ms],
})
export class ChatComponent implements OnInit {

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);

  loading$ = new BehaviorSubject<boolean>(false);
  conversations$: Observable<Conversation[]> = this.conversationsSubject.asObservable();
  searchCtrl = new UntypedFormControl();

  mobileQuery$ = this._layoutService.ltMd$;
  drawerOpen$ = this._chatService.drawerOpen$;

  constructor(
    private _router: Router,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _conversationService: ConversationService,
    private _layoutService: VexLayoutService
  ) {
  }

  ngOnInit() {
    this.syncSubscribers();
    this.loadConversations();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(() => {
        this.conversationsSubject.next([]);
        this.loadConversations();
      });
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
    const datetime = this.getLastConversationDate();
    this.loadConversations(datetime);
  }

  onAddNewConversation() {
    console.log("AddNewConversation");
  }

  private syncSubscribers() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => isMobile),
      )
      .subscribe(() => this.closeDrawer());

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => !isMobile),
      )
      .subscribe(() => this.openDrawer());

    this.mobileQuery$.subscribe(isMobile => {
      if (isMobile) {
        this._chatService.drawerOpen.next(false);
      } else {
        this._chatService.drawerOpen.next(true);
      }
    });
  }

  private loadConversations(datetime?: string) {
    if (this.loading$.value) return;

    this.loading$.next(true);

    this._conversationService.list(datetime, this.searchCtrl?.value || '')
      .subscribe({
        next: (conversations) => {
          const current = this.conversationsSubject.value;
          const merged = [...current, ...conversations];
          this.conversationsSubject.next(merged);
        },
        error: (err) => {
          console.error('Error when load conversations:', err);
        },
        complete: () => {
          this.loading$.next(false);
        }
      });
  }

  private getLastConversationDate(): string | undefined {
    const conversations = this.conversationsSubject.value;
    if (!conversations.length) return undefined;

    const lastConversation = conversations[conversations.length - 1];
    const lastMessage = lastConversation.messages?.[lastConversation.messages.length - 1];

    return lastMessage?.createdAt;
  }

}
