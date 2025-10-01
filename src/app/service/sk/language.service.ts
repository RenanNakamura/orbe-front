import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from 'src/app/model/sk/Language';
import { LanguageUtil } from 'src/app/util/language.util';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private langSubject = new BehaviorSubject<string>('pt');
  lang$ = this.langSubject.asObservable();

  constructor() {}

  changeLang(lang: string) {
    this.langSubject.next(lang);
  }

  get currentLang() {
    return this.langSubject.value;
  }

  isPtBR(): boolean {
    return (
      LanguageUtil.toLanguage(this.langSubject.value) ===
      Language.PORTUGUESE_BRAZIL
    );
  }

  getErrorMessage(error: {
    code: string;
    messages: { pt_br: string; en_us: string };
  }): { code: string; message: string } {
    if (!error) {
      return;
    }
    switch (LanguageUtil.toLanguage(this.langSubject.value)) {
      case Language.ENGLISH_US:
        return {
          code: error.code,
          message: error?.messages?.en_us
        };
      default:
        return {
          code: error.code,
          message: error?.messages?.pt_br
        };
    }
  }
}
