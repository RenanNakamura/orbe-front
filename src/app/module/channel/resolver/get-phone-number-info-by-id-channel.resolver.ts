import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PhoneNumberInfo} from '../../../model/PhoneNumberInfo';
import {PhoneNumberInfoService} from '../../../service/channel/phone-number-info.service';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GetPhoneNumberInfoByIdChannelResolver implements Resolve<PhoneNumberInfo> {

    constructor(private readonly _service: PhoneNumberInfoService) { }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<PhoneNumberInfo> | Promise<PhoneNumberInfo> | PhoneNumberInfo {
        const channelId = route.paramMap.get('id');
        if (!channelId) {
            return of(null);
        }

        return this._service.get(channelId).pipe(
            catchError((error) => {
                console.error('Error when get PhoneNumberInfo:', error);
                return of(null);
            })
        );
    }

}
