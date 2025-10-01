import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Channel} from '../../../model/Channel';
import {ChannelService} from '../../../service/channel/channel.service';

@Injectable({
    providedIn: 'root'
})
export class GetByIdChannelResolver implements Resolve<Channel> {

    constructor(private readonly _service: ChannelService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Channel> | Promise<Channel> | Channel {
        const id = route.paramMap.get('id');
        return this._service.get(id);
    }

}
