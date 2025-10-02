import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Campaign} from '../../../model/Campaign';
import {CampaignService} from '../../../service/campaign/campaign.service';

@Injectable({
    providedIn: 'root'
})
export class GetByIdCampaignResolver implements Resolve<Campaign> {

    constructor(private readonly _service: CampaignService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign> | Promise<Campaign> | Campaign {
        const id = route.paramMap.get('id');
        return this._service.get(id);
    }

}
