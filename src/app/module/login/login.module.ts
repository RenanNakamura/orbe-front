import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    SignInComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    OnboardingComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
    MatButtonModule,
    MatSelectModule,
  ]
})
export class LoginModule {}
