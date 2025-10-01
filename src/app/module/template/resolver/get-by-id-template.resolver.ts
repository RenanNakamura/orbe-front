import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Template} from '../../../model/Template';
import {TemplateService} from '../../../service/template/template.service';

@Injectable({
    providedIn: 'root'
})
export class GetByIdTemplateResolver implements Resolve<Template> {

    constructor(private readonly _service: TemplateService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Template> | Promise<Template> | Template {
        const id = route.paramMap.get('id');
        return this._service.get(id);
    }

}
