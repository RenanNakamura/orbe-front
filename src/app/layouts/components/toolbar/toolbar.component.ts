import {Component, DestroyRef, HostBinding, inject, OnInit} from '@angular/core';
import {VexLayoutService} from '@vex/services/vex-layout.service';
import {VexConfigService} from '@vex/config/vex-config.service';
import {filter, map, startWith} from 'rxjs/operators';
import {NavigationService} from '../../../core/navigation/navigation.service';
import {Observable} from 'rxjs';
import {NavigationComponent} from '../navigation/navigation.component';
import {ToolbarUserComponent} from './toolbar-user/toolbar-user.component';
import {NavigationItemComponent} from '../navigation/navigation-item/navigation-item.component';
import {MatMenuModule} from '@angular/material/menu';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NavigationItem} from '../../../core/navigation/navigation-item.interface';
import {checkRouterChildsData} from '@vex/utils/check-router-childs-data';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageUtil} from '../../../util/language.util';
import {UserService} from '../../../service/user/user.service';
import {UserStorage} from '../../../storage/user/user.storage';
import {LanguageService} from '../../../service/sk/language.service';
import {TokenStorage} from "../../../storage/user/token.storage";
import {AgentService} from "../../../service/agent/agent.service";

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    RouterLink,
    MatMenuModule,
    NgFor,
    NavigationItemComponent,
    ToolbarUserComponent,
    NavigationComponent,
    AsyncPipe,
    TranslateModule
  ]
})
export class ToolbarComponent implements OnInit {
  @HostBinding('class.shadow-b')
  showShadow: boolean = false;

  navigationItems$: Observable<NavigationItem[]> =
    this.navigationService.items$;

  isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'horizontal')
  );
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'in-toolbar')
  );
  isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'below-toolbar')
  );
  userVisible$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );
  title$: Observable<string> = this.configService.select(
    (config) => config.sidenav.title
  );

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  selectedEmojine = 'flag:united-states';
  isUserToken = true;

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly configService: VexConfigService,
    private readonly navigationService: NavigationService,
    private readonly router: Router,
    private _userService: UserService,
    private _userStorage: UserStorage,
    private _tokenStorage: TokenStorage,
    private _agentService: AgentService,
    private _languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.showShadow = checkRouterChildsData(
          this.router.routerState.root.snapshot,
          (data) => data.toolbarShadowEnabled ?? false
        );
      });

    this.isUserToken = this._tokenStorage.isUserToken();
    this.loadDefaultLang();
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  async onChangeLang(lang, emojine) {
    const language = LanguageUtil.toLanguage(lang);

    if (this.isUserToken) {
      await this._userService.changeLanguage({language});
    } else {
      await this._agentService.changeLanguage({language});
    }

    this._languageService.changeLang(lang);

    const userLogged = this._userStorage.get();
    this._userStorage.set(Object.assign(userLogged, {language}));

    this.selectedEmojine = emojine;
  }

  private loadDefaultLang() {
    const userLogged = this._userStorage?.get();

    if (userLogged) {
      const lang = LanguageUtil.toLang(userLogged.language);
      this.selectedEmojine = this.toEmoji(lang);
    } else {
      this.selectedEmojine = this.toEmoji('pt');
    }
  }

  private toEmoji(lang: string) {
    switch (lang) {
      case 'pt':
        return 'flag:brazil';
      case 'us':
        return 'flag:united-states';
    }
  }
}
