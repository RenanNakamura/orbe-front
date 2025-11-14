import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TitlePageStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private _translate: TranslateService
  ) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(`Tipefy - ${this._translate.instant(title)}`);
    }
  }
}
