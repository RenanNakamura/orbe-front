import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {Message, MessageType} from "../model/chat/conversation";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'lastMessage'
})
export class LastMessagePipe implements PipeTransform {

  constructor(private _translate: TranslateService) {}

  transform(message?: Message): string {
    if (!message || !message.content) {
      return '';
    }

    const content = message.content;

    switch (content.type) {
      case MessageType.TEXT:
        return content.text?.body ?? '';

      case MessageType.IMAGE:
        return `📷 ${this._translate.instant(`photo`)}`;

      case MessageType.VIDEO:
        return `🎥 ${this._translate.instant(`video`)}`;

      case MessageType.DOCUMENT:
        return `📎 ${this._translate.instant(`document`)}`;

      default:
        return content?.text?.body ?? '';
    }
  }
}


@NgModule({
  declarations: [LastMessagePipe],
  exports: [LastMessagePipe],
})
export class LastMessagePipeModule {
}
