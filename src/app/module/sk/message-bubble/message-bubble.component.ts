import {Component, Input, OnInit} from '@angular/core';
import {ButtonMessage, ListMessage, MediaMessage, Type} from '../../../model/flow/Message';
import {Entry, Status} from '../../../model/flow/Flow';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss']
})
export class MessageBubbleComponent implements OnInit {

  @Input() message: any;
  @Input() entry: Entry;
  @Input() createdDate: string;
  @Input() executedDate: string;
  @Input() status: Status;
  @Input() error: { code: string; message: string };

  link: SafeResourceUrl;
  body: string;
  icStatus: any;
  buttons: { id: string, text: string, icon?: string }[];

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fillLink();
    this.fillIconStatus();
    this.fillButtons();
  }

  isReceivedEntry(): boolean {
    return this.entry === Entry.RECEIVED;
  }

  isCommandEntry(): boolean {
    return this.entry === Entry.COMMAND;
  }

  isSentEntry(): boolean {
    return this.entry === Entry.SENT;
  }

  private fillLink() {
    switch (this.message.type) {
      case Type.IMAGE:
      case Type.VIDEO:
        this.link = this._sanitizer.bypassSecurityTrustUrl((this.message as MediaMessage)?.link);
        break;
      case Type.DOCUMENT:
        this.link = this._sanitizer.bypassSecurityTrustResourceUrl((this.message as MediaMessage)?.link);
        break;
    }
  }

  private fillIconStatus() {
    switch (this.status) {
      case Status.ON_HOLD:
      case Status.SENDING:
        this.icStatus = 'mat:watch_later';
        break;
      case Status.SENT:
        this.icStatus = 'mat:check';
        break;
      case Status.DELIVERED:
      case Status.READ:
        this.icStatus = 'mat:done_all';
        break;
      case Status.ERROR:
      case Status.FAILED:
        this.icStatus = 'mat:error';
        break;
    }
  }

  private fillButtons() {
    if (this.message.type === 'BUTTON') {
      this.buttons = (this.message as ButtonMessage)?.buttons
        ?.map(button => {
          return {
            id: button.id,
            text: button.text,
            icon: 'mat:reply'
          };
        });
    }
    if (this.message.type === 'LIST') {
      this.buttons = [{id: '', text: (this.message as ListMessage)?.button, icon: 'mat:format_list_bulleted'}];
    }
  }
}
