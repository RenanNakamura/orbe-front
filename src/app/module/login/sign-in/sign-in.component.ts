import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user/user.service';
import {TokenStorage} from '../../../storage/user/token.storage';
import {Router} from '@angular/router';
import {UserStorage} from '../../../storage/user/user.storage';
import {environment} from 'src/environments/environment';
import {RefreshTokenStorage} from '../../../storage/user/refresh-token.storage';
import {LanguageService} from '../../../service/sk/language.service';
import {LanguageUtil} from '../../../util/language.util';
import {HttpResponse} from "@angular/common/http";
import {LoggedUser, Role} from "../../../model/User";
import {take} from "rxjs/operators";
import {NavigationLoaderService} from "../../../core/navigation/navigation-loader.service";
import {ChatWebSocketService} from "../../../service/chat/chat-websocket.service";

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
  isLoading = false;

  constructor(private _router: Router,
              private _formBuilder: UntypedFormBuilder,
              private _userService: UserService,
              private _tokenStorage: TokenStorage,
              private _refreshTokenStorage: RefreshTokenStorage,
              private _userStorage: UserStorage,
              private _changeDetectorRef: ChangeDetectorRef,
              private _languageService: LanguageService,
              private _navigationLoaderService: NavigationLoaderService,
              private _chatWebSocket: ChatWebSocketService) {
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
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;

      grecaptcha.ready(() => {
        grecaptcha.execute(environment.receptcha.sitekey, {action: 'LOGIN'}).then((token) => {
          this._userService.login(token, this.form.value)
            .pipe(take(1))
            .subscribe({
              next: (response: HttpResponse<LoggedUser>) => {
                this._tokenStorage.set(response.headers.get('Access-Token'));
                this._refreshTokenStorage.set(response.headers.get('Refresh-Token'));

                const plan = this._tokenStorage.getClaim('plan');

                this._userStorage.set({...response.body, plan});

                const userLogged = this._userStorage?.get();

                if (userLogged) {
                  const lang = LanguageUtil.toLang(userLogged.language);
                  this._languageService.changeLang(lang);
                }

                this.isLoading = false;

                this._navigationLoaderService.loadNavigation();

                // WebSockets connects...
                this._chatWebSocket.connect();

                if (userLogged.role === Role.AGENT) {
                  this._router.navigate(['/chat']);
                } else {
                  this._router.navigate(['']);
                }
              },
              error: () => {
                this.isLoading = false;
              }
            });
        });
      });
    }
  }
}
