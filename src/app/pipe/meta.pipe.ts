import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {MessageError} from "../model/chat/conversation";
import {LanguageService} from "../service/sk/language.service";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {BehaviorSubject, Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, finalize, map, switchMap} from "rxjs/operators";
import {StorageService} from "../service/storage/storage.service";

interface MediaAsyncPipeState {
  loading: boolean;
  url?: SafeUrl;
  error?: string;
}

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

@Pipe({
  name: 'mediaAsync',
  pure: true
})
export class MediaAsyncPipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  transform(media: { id: string }, channelId: string): Observable<MediaAsyncPipeState> {
    if (!media || !channelId) {
      return of({loading: false});
    }

    const subject = new BehaviorSubject<MediaAsyncPipeState>({loading: true});

    this.http.get(`${environment.whatsappService}/medias/${media.id}`, {
      responseType: 'blob',
      params: {channelId},
      headers: {'X-Skip-Global-Error': 'true'}
    })
      .pipe(
        map(blob => {
          const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
          return {loading: false, url};
        }),
        catchError(err => {
          subject.next({loading: false, error: err.message});
          return of({loading: false, error: err.message});
        }),
        finalize(() => subject.next({...subject.getValue(), loading: false}))
      )
      .subscribe(state => subject.next(state));

    return subject.asObservable();
  }
}

@Pipe({
  name: 'storageAsync',
  pure: true
})
export class StorageAsyncPipe implements PipeTransform {

  constructor(private storageService: StorageService, private sanitizer: DomSanitizer) {
  }

  transform(fileName: string): Observable<MediaAsyncPipeState> {
    if (!fileName) {
      return of({loading: false});
    }

    const subject = new BehaviorSubject<MediaAsyncPipeState>({loading: true});

    this.storageService.getSharedUrl(fileName)
      .then(response => {
        const url = this.sanitizer.bypassSecurityTrustUrl(response.url);
        subject.next({loading: false, url});
      })
      .catch(err => {
        subject.next({loading: false, error: err.message || 'Failed to load media'});
      });

    return subject.asObservable();
  }
}

@NgModule({
  declarations: [
    MapWhatsAppErrorPipe,
    MediaAsyncPipe,
    StorageAsyncPipe
  ],
  exports: [
    MapWhatsAppErrorPipe,
    MediaAsyncPipe,
    StorageAsyncPipe
  ],
})
export class MetaPipeModule {
}
