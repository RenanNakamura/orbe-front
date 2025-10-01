import {Component, OnInit} from '@angular/core';
import icLock from '@iconify/icons-ic/lock';
import icMail from '@iconify/icons-ic/twotone-mail';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icLanguage from '@iconify/icons-ic/language';
import icWebhook from '@iconify/icons-ic/link';
import icCloud from '@iconify/icons-ic/cloud';
import {fadeInUp400ms} from '../../../../../@vex/animations/fade-in-up.animation';
import {fadeInRight400ms} from '../../../../../@vex/animations/fade-in-right.animation';
import {scaleIn400ms} from '../../../../../@vex/animations/scale-in.animation';
import {stagger40ms} from '../../../../../@vex/animations/stagger.animation';
import {UserService} from '../../../../service/user/user.service';
import {User} from '../../../../model/User';
import {PhoneUtil} from '../../../../util/phone.util';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {WebhookComponent} from '../webhook/webhook.component';
import {WebhookService} from '../../../../service/webhook/webhook.service';
import {Webhook} from '../../../../model/Webhook';
import {WhatsAppAccount} from '../../../../model/WhatsAppAccount';

@Component({
    selector: 'my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    animations: [
        fadeInUp400ms,
        fadeInRight400ms,
        scaleIn400ms,
        stagger40ms
    ]
})
export class MyProfileComponent implements OnInit {

    icPhone = icPhone;
    icMail = icMail;
    icSecurity = icLock;
    icLanguage = icLanguage;
    icCloud = icCloud;
    icWebhook = icWebhook;

    user: User;
    webhook: Webhook;
    whatsAppBusinessAccount: WhatsAppAccount;

    constructor(private _service: UserService,
                private _webhookService: WebhookService,
                private _dialog: MatDialog) {
    }

    ngOnInit(): void {
        this._service.personalData()
            .subscribe(response => {
                this.user = response.body;
            });
        this.loadWebhook();
    }

    onGetMask(ddi: string) {
        return PhoneUtil.getPhoneMask(ddi);
    }

    onChangePassword() {
        this._dialog.open(ChangePasswordComponent, {width: '800px'})
            .afterClosed()
            .subscribe(() => {});
    }

    onWebhook() {
        this._dialog.open(WebhookComponent, {width: '600px', data: this.webhook})
            .afterClosed()
            .subscribe(() => this.loadWebhook());
    }

    private loadWebhook() {
        this._webhookService.get()
            .subscribe(response => {
                this.webhook = response;
            });
    }

}
