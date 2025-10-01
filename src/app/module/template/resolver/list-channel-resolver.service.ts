import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ChannelService} from '../../../service/channel/channel.service';
import {Channel, ChannelParams} from '../../../model/Channel';
import {Page} from '../../../model/sk/Page';

@Injectable({
    providedIn: 'root'
})
export class ListChannelResolver implements Resolve<Page<Channel>> {

    constructor(private readonly _service: ChannelService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<Page<Channel>> | Promise<Page<Channel>> | Page<Channel> {
        return this._service.list(this.getDefaultParams());
    }

    private getDefaultParams(): ChannelParams {
        return {
            sort: 'createdDate,desc',
        };
    }

}
