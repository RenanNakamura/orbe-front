import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {UserService} from '../../../service/user/user.service';
import {AlertService} from '../../../service/sk/alert.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';

declare var grecaptcha: any;

@Component({
    selector: 'vex-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    isSuccess = false;

    constructor(private readonly fb: UntypedFormBuilder,
                private _service: UserService,
                private _alertService: AlertService,
                private _translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    async onSubmit() {
        if (this.form.valid) {
            const recoverPassword = {
                email: this.form.get('email').value
            };

            grecaptcha.ready(() => {
                grecaptcha.execute(environment.receptcha.sitekey, {action: 'RECOVER_PASSWORD'}).then((token) => {
                    this._service.recoverPassword(token, recoverPassword)
                        .subscribe(() => {
                            const msg = this._translate.get('login.forgot.password.recover.email.valid');
                            msg.subscribe(message => this._alertService.success(message));
                            this.isSuccess = true;
                        });
                });
            });
        }
    }

}
