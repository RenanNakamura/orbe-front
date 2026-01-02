import {Component, OnInit} from '@angular/core';
import {Link} from '../../../../@vex/interfaces/link.interface';
import {scaleIn400ms} from '../../../../@vex/animations/scale-in.animation';
import {fadeInRight400ms} from '../../../../@vex/animations/fade-in-right.animation';
import {UserStorage} from '../../../storage/user/user.storage';
import {LoggedUser} from '../../../model/User';
import { TokenStorage } from '../../../storage/user/token.storage';

@Component({
    selector: 'my-account',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [
        scaleIn400ms,
        fadeInRight400ms
    ]
})
export class FormComponent implements OnInit {

    links: Link[] = [
        {
            label: 'my-profile',
            route: './',
            routerLinkActiveOptions: {exact: true}
        },
    ];

    loggedUser: LoggedUser;
    tenantId: string;
    agentId: string;

    constructor(private _storage: UserStorage,
                private _tokenStorage: TokenStorage) {
    }

    ngOnInit(): void {
        this.loggedUser = this._storage.get();
        this.tenantId = this._tokenStorage.getTenantId();
        this.agentId = this._tokenStorage.getAgentId();
    }

}
