import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  Button,
  ButtonAction,
  ButtonType,
  Format,
  Header,
  ItemButton
} from '../../../model/Template';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingService } from '../../../service/sk/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'template-message',
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.scss']
})
export class TemplateMessageComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  header: Header;

  @Input()
  body: string;

  @Input()
  footer: string;

  @Input()
  button: Button;

  @Input()
  fileUrl: string;

  safeFileUrl: SafeResourceUrl;

  isLoading = false;
  loadingSubscription: Subscription;

  constructor(
    public sanitizer: DomSanitizer,
    private _loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this._loadingService.loading$.subscribe(
      (loading: boolean) => {
        this.isLoading = loading;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['fileUrl']) {
      this.changeFileUrl();
    }
  }

  ngOnDestroy(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }

    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  isButtonQuickReply(): boolean {
    return this.button?.action === ButtonAction.QUICK_REPLY;
  }

  isButtonCallToAction(): boolean {
    return this.button?.action === ButtonAction.CALL_TO_ACTION;
  }

  hasButtonText(): boolean {
    return (
      (this.isButtonQuickReply() || this.isButtonCallToAction()) &&
      !!this.button.buttons.find((button) => button?.text?.length)
    );
  }

  isButtonPhoneNumber(button: ItemButton) {
    return button.type === ButtonType.PHONE_NUMBER;
  }

  isButtonUrl(button: ItemButton) {
    return button.type === ButtonType.URL;
  }

  isHeaderTextSelected(): boolean {
    return this.header?.format === Format.TEXT;
  }

  isHeaderImageSelected(): boolean {
    return this.header?.format === Format.IMAGE;
  }

  isHeaderVideoSelected(): boolean {
    return this.header?.format === Format.VIDEO;
  }

  isHeaderDocumentSelected(): boolean {
    return this.header?.format === Format.DOCUMENT;
  }

  isMedia(): boolean {
    return (
      this.isHeaderImageSelected() ||
      this.isHeaderDocumentSelected() ||
      this.isHeaderVideoSelected()
    );
  }

  private changeFileUrl() {
    switch (this.header?.format) {
      case Format.DOCUMENT:
        this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.fileUrl
        );
        break;
      default:
        this.safeFileUrl = this.sanitizer.bypassSecurityTrustUrl(this.fileUrl);
    }
  }
}
