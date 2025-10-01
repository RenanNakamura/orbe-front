import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { WebhookComponent } from './webhook/webhook.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  exports: [MyProfileComponent],
  declarations: [MyProfileComponent, ChangePasswordComponent, WebhookComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TranslateModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    NgxMaskPipe
  ],
  providers: [provideNgxMask()]
})
export class ProfileModule {}
