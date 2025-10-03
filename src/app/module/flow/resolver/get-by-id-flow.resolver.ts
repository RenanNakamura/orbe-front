import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Flow} from "../../../model/flow/Flow";
import {FlowService} from "../../../service/flow/flow.service";

@Injectable({
    providedIn: 'root'
})
export class GetByIdFlowResolver implements Resolve<Flow> {

    constructor(private readonly _service: FlowService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flow> | Promise<Flow> | Flow {
        const id = route.paramMap.get('id');
        return this._service.get(id);
    }

}
