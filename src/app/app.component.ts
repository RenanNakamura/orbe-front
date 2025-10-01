import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
// import { PlanEnum, Role } from './model/User';
// import { UserStorage } from './storage/user/user.storage';
// import { LanguageUtil } from './util/language.util';
import { LanguageService } from './service/sk/language.service';
import { NavigationService } from './core/navigation/navigation.service';
import { LanguageUtil } from './util/language.util';
import { UserStorage } from './storage/user/user.storage';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private _renderer: Renderer2,
    private _platform: Platform,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LOCALE_ID) private _localeId: string,
    private _navigationService: NavigationService,
    private _translate: TranslateService,
    private _userStorage: UserStorage,
    private _languageService: LanguageService
  ) {
    Settings.defaultLocale = this._localeId;

    this.loadDefaultLang();

    if (this._platform.BLINK) {
      this._renderer.addClass(this._document.body, 'is-blink');
    }
  }

  private loadDefaultLang() {
    this._languageService.lang$.subscribe((lang) => {
      this._translate.setDefaultLang(lang);
      this._translate.use(lang);
    });

    const userLogged = this._userStorage?.get();

    if (userLogged) {
      const lang = LanguageUtil.toLang(userLogged.language);
      this._languageService.changeLang(lang);
    }
  }
}
