import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {OnboardingService} from '../../../service/user/onboarding.service';
import {FinishOnboarding, Onboarding} from '../../../model/User';
import {Language} from '../../../model/sk/Language';
import {environment} from '../../../../environments/environment';

declare var grecaptcha: any;

@Component({
  selector: 'vex-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  form = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    language: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: this.passwordIsMatch
  });

  languages = Language;
  isSuccess = false;
  token = '';
  onboardingId = '';

  constructor(private readonly fb: UntypedFormBuilder,
              private _service: OnboardingService,
              private readonly activatedRoute: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute
      .params
      .subscribe(params => {
        this.token = params?.['token'];
        this.onboardingId = params?.['onboardingId'];

        this._service.get(this.onboardingId, this.token)
          .subscribe(onboarding => this.loadOnboardingOnForm(onboarding));
      });
  }

  async onSubmit() {
    if (this.form.valid) {
      const user: FinishOnboarding = {
        name: this.form.get('name').value,
        language: this.form.get('language').value,
        password: this.form.get('password').value,
      };

      grecaptcha.ready(() => {
        grecaptcha.execute(environment.receptcha.sitekey, {action: 'ONBOARDING'})
          .then((token) => {
            this._service.finish(this.onboardingId, this.token, token, user)
              .subscribe(() => {
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
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!confirmPassword?.value) {
      return;
    }

    if (password?.value !== confirmPassword?.value) {
      control.get('confirmPassword').setErrors({passwordNotMatch: true});
    }

    if (password?.value === confirmPassword?.value) {
      control.get('confirmPassword').setErrors(null);
    }
  }

  private loadOnboardingOnForm(onboarding: Onboarding) {
    this.form = this.fb.group({
      name: [onboarding?.customerName || '', [Validators.required]],
      phone: [{value: onboarding?.customerPhone || '', disabled: true}, [Validators.required]],
      email: [{value: onboarding?.customerEmail || '', disabled: true}, [Validators.required, Validators.email]],
      language: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordIsMatch
    });
  }

}
