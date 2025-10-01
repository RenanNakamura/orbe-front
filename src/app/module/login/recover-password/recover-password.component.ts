import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user/user.service';
import {AlertService} from '../../../service/sk/alert.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from 'src/environments/environment';

declare var grecaptcha: any;

@Component({
    selector: 'vex-forgot-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', Validators.required],
    }, {
        validator: this.passwordIsMatch
    });

    isSuccess = false;
    token = '';
    recoverPasswordId = '';

    constructor(private readonly fb: UntypedFormBuilder,
                private _service: UserService,
                private _alertService: AlertService,
                private readonly activatedRoute: ActivatedRoute,
                private _router: Router,
                private _translate: TranslateService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.token = params?.['token'];
            this.recoverPasswordId = params?.['recoverPasswordId'];
        });
    }

    async onSubmit() {
        if (this.form.valid) {
            const recoverPassword = {
                email: this.form.get('email').value,
                token: this.token,
                recoverPasswordId: this.recoverPasswordId,
                newPassword: this.form.get('newPassword').value
            };

            grecaptcha.ready(() => {
                grecaptcha.execute(environment.receptcha.sitekey, {action: 'RECOVER_PASSWORD'}).then((token) => {
                    this._service.recoverPasswordUser(token, recoverPassword)
                    .subscribe(() => {
                        const msg = this._translate.get('login.recover.password.change.email.valid');
                        msg.subscribe(message => this._alertService.success(message));
                        this.isSuccess = true;

                        setTimeout(() => {
                            this._router.navigate(['/login']);
                        }, 3000);
                    });
                });
            });
        }
    }

    passwordIsMatch(control: UntypedFormGroup) {
        const password = control.get('newPassword');
        const confirmPassword = control.get('confirmNewPassword');

        if (!confirmPassword?.value) {
            return;
        }

        if (password?.value !== confirmPassword?.value) {
            control.get('confirmNewPassword').setErrors({passwordNotMatch: true});
        }

        if (password?.value === confirmPassword?.value) {
            control.get('confirmNewPassword').setErrors(null);
        }
    }

}
