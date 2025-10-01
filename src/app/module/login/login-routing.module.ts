import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from './recover-password/recover-password.component';
import {OnboardingComponent} from './onboarding/onboarding.component';

const routes: Routes = [
    {
        path: '',
        component: SignInComponent,
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'forgot-password/recover-password/:recoverPasswordId/:token',
        component: RecoverPasswordComponent,
    },
    {
          path: 'onboarding/:onboardingId/:token',
        component: OnboardingComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}
