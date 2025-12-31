import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {Message, MessageType} from "../model/chat/conversation";
import {TranslateService} from "@ngx-translate/core";
import {Body, Format, Header} from "../model/Template";

@Pipe({
  name: 'lastMessage'
})
export class LastMessagePipe implements PipeTransform {

  constructor(private _translate: TranslateService) {
  }

  transform(message?: Message): string {
    if (!message || !message.content) {
      return '';
    }

    const content = message.content;

    switch (content.type) {
      case MessageType.TEXT:
        return content?.text?.body ?? '';

      case MessageType.IMAGE:
        return `📷 ${this._translate.instant(`photo`)}`;

      case MessageType.VIDEO:
        return `🎥 ${this._translate.instant(`video`)}`;

      case MessageType.DOCUMENT:
        return `📎 ${this._translate.instant(`document`)}`;

      case MessageType.STICKER:
        return `🗒️ ${this._translate.instant(`sticker`)}`;

      case MessageType.AUDIO:
        return `🎤 ${this._translate.instant(`voice-message`)}`;

      case MessageType.BUTTON:
        return content?.button?.text || content?.button?.payload || '';

      case MessageType.TEMPLATE: {
        const components = content?.template?.componentsFilled ?? [];

        const header = components.find(c => c.type === 'HEADER') as Header;
        const body = components.find(c => c.type === 'BODY') as Body;
        const headerText = header?.text ?? '';
        const bodyText = body?.text ?? '';

        if (header?.format) {
          switch (header.format) {
            case Format.IMAGE:
              return `📷 ${bodyText}`;

            case Format.VIDEO:
              return `🎥 ${bodyText}`;

            case Format.DOCUMENT:
              return `📎 ${bodyText}`;
          }
        }

        if (headerText && bodyText) {
          return `${headerText} ${bodyText}`;
        }

        return headerText || bodyText || '';
      }

      case MessageType.UNSUPPORTED:
        return `${this._translate.instant(`unsupported-message`)}`;

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
