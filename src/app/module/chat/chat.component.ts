import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {scaleFadeIn400ms} from "@vex/animations/scale-fade-in.animation";
import {Observable, switchMap} from "rxjs";
import {Conversation} from "../../model/chat/conversation";
import {ChatService} from "../../service/chat/chat.service";
import {VexLayoutService} from "@vex/services/vex-layout.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, startWith} from "rxjs/operators";

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [scaleFadeIn400ms],
})
export class ChatComponent implements OnInit {

  conversations$: Observable<Conversation[]>;
  mobileQuery$ = this._layoutService.ltMd$;
  drawerOpen$ = this._chatService.drawerOpen$;

  constructor(
    private _router: Router,
    private _cd: ChangeDetectorRef,
    private _chatService: ChatService,
    private _layoutService: VexLayoutService
  ) {
  }

  ngOnInit() {
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

}
