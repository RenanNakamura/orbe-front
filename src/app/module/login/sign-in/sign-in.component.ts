import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import {UserService} from '../../../service/user/user.service';
import {take} from 'rxjs/operators';
import {TokenStorage} from '../../../storage/user/token.storage';
import {Router} from '@angular/router';
import {UserStorage} from '../../../storage/user/user.storage';
import {environment} from 'src/environments/environment';
import {RefreshTokenStorage} from '../../../storage/user/refresh-token.storage';
import {LanguageService} from '../../../service/sk/language.service';
import {LanguageUtil} from '../../../util/language.util';

declare var grecaptcha: any;

@Component({
    selector: 'vex-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    form: UntypedFormGroup;

    inputType = 'password';
    visible = false;
    icVisibility = icVisibility;
    icVisibilityOff = icVisibilityOff;

    constructor(private _router: Router,
                private _formBuilder: UntypedFormBuilder,
                private _userService: UserService,
                private _tokenStorage: TokenStorage,
                private _refreshTokenStorage: RefreshTokenStorage,
                private _userStorage: UserStorage,
                private _changeDetectorRef: ChangeDetectorRef,
                private _languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    onToggleVisibility() {
        if (this.visible) {
            this.inputType = 'password';
            this.visible = false;
        } else {
            this.inputType = 'text';
            this.visible = true;
        }

        this._changeDetectorRef.markForCheck();
    }

    onSignIn() {
        if (this.form.valid) {
            grecaptcha.ready(() => {
                grecaptcha.execute(environment.receptcha.sitekey, {action: 'LOGIN'}).then((token) => {
                    this._userService.login(token, this.form.value)
                        .pipe(take(1))
                        .subscribe(response => {
                            this._tokenStorage.set(response.headers.get('Access-Token'));
                            this._refreshTokenStorage.set(response.headers.get('Refresh-Token'));

                            const plan = this._tokenStorage.getClaim('plan');

                            this._userStorage.set({...response.body, plan});

                            const userLogged = this._userStorage?.get();

                            if (userLogged) {
                                const lang = LanguageUtil.toLang(userLogged.language);
                                this._languageService.changeLang(lang);
                            }

                            this._router.navigate(['/']);
                        });
                });
            });
        }
    }
}
