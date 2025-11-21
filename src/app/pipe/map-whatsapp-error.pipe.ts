import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {MessageError} from "../model/chat/conversation";
import {LanguageService} from "../service/sk/language.service";

@Pipe({
  name: 'MapWhatsAppError'
})
export class MapWhatsAppErrorPipe implements PipeTransform {

  constructor(private _languageService: LanguageService) {
  }

  transform(messageError: MessageError): string {
    if (!messageError) {
      return;
    }

    switch (this._languageService?.currentLang) {
      case 'us':
        return `${messageError?.code} - ${messageError?.messages?.enUs}`
      default:
        return `${messageError?.code} - ${messageError?.messages?.ptBr}`
    }
  }

}

@NgModule({
  declarations: [MapWhatsAppErrorPipe],
  exports: [MapWhatsAppErrorPipe],
})
export class MetaPipeModule {
}
