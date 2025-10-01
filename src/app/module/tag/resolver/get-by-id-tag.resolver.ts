import {Injectable} from '@angular/core';
import {Tag} from '../../../model/Tag';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {TagService} from '../../../service/tag/tag.service';

@Injectable({
    providedIn: 'root'
})
export class GetByIdTagResolver implements Resolve<Tag> {

    constructor(private readonly _service: TagService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag> | Promise<Tag> | Tag {
        const id = route.paramMap.get('id');
        return this._service.get(id);
    }

}
