import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelRoutingModule} from './channel-routing.module';
import {ListComponent} from './list/list.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SkModule} from '../sk/sk.module';
import {DialogComponent} from './dialog/dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {NgxMaskPipe, provideNgxMask} from 'ngx-mask';
import {StatusColorPipeModule} from './pipe/label-status-color.pipe';
import {CreationTypeColorPipeModule} from './pipe/label-creation-type-color.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import {FormComponent} from './form/form.component';
import {MatCardModule} from '@angular/material/card';
import {ChannelHealthStatusComponent} from './channel-health-status/channel-health-status.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ConnectWhatsappComponent} from './connect-channel/connect-whatsapp.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {VexPageLayoutContentDirective} from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import {VexPageLayoutHeaderDirective} from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import {VexPageLayoutComponent} from '@vex/components/vex-page-layout/vex-page-layout.component';

@NgModule({
  declarations: [
    ListComponent,
    DialogComponent,
    FormComponent,
    ChannelHealthStatusComponent,
    ConnectWhatsappComponent
  ],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    SkModule,
    MatSelectModule,
    StatusColorPipeModule,
    CreationTypeColorPipeModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent,
    NgxMaskPipe
  ],
  providers: [provideNgxMask()]
})
export class ChannelModule {
}
