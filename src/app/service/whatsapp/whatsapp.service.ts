import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {MessageData} from 'src/app/model/whatsapp/MessageData';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {

  constructor(private readonly _http: HttpClient) {
  }

  getMessagesAmountSeries(phoneNumberId: string, lastDays: string): Observable<MessageData[]> {
    const params = new HttpParams()
      .set('lastDays', lastDays)
      .set('timezone', moment.tz.guess());
    return this._http.get<MessageData[]>(`${environment.whatsappService}/dashboard/${phoneNumberId}`, {params});
  }

  upload(channelId: string, file: File): Promise<{ h: string }> {
    const formData = new FormData();

    formData.append('file', file);

    return firstValueFrom(this._http.post<any>(`${environment.whatsappService}/medias/${channelId}/upload`, formData));
  }

}
