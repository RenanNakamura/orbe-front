import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {BehaviorSubject, Observable, of} from "rxjs";
import {StorageService} from "../service/storage/storage.service";

interface StorageAsyncPipeState {
  loading: boolean;
  url?: SafeUrl;
  error?: string;
}

@Pipe({
  name: 'storageAsync',
  pure: true
})
export class StorageAsyncPipe implements PipeTransform {

  constructor(private storageService: StorageService, private sanitizer: DomSanitizer) {
  }

  transform(fileName: string): Observable<StorageAsyncPipeState> {
    if (!fileName) {
      return of({loading: false});
    }

    const subject = new BehaviorSubject<StorageAsyncPipeState>({loading: true});

    console.log('fileName', fileName);

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
    StorageAsyncPipe
  ],
  exports: [
    StorageAsyncPipe
  ],
})
export class StoragePipeModule {
}
