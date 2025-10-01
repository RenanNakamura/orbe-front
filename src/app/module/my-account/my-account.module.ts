import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { FormComponent } from './form/form.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    TranslateModule,
    MatTabsModule,
    ReactiveFormsModule
  ]
})
export class MyAccountModule {}
