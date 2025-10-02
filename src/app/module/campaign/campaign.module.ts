import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CampaignRoutingModule} from './campaign-routing.module';
import {ListComponent} from './list/list.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {SkModule} from '../sk/sk.module';
import {StatusColorPipeModule} from './pipe/label-status-color.pipe';
import {StatusPipeModule} from './pipe/status.pipe';
import {DateMomentPipeModule} from '../../pipe/date-moment.pipe';
import {FormComponent} from './form/form.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ViewComponent} from './view/view.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ListVariableComponent} from '../../component/list-group/list-variable.component';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {VexPageLayoutHeaderDirective} from "@vex/components/vex-page-layout/vex-page-layout-header.directive";
import {VexPageLayoutComponent} from "@vex/components/vex-page-layout/vex-page-layout.component";
import {VexPageLayoutContentDirective} from "@vex/components/vex-page-layout/vex-page-layout-content.directive";

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    ViewComponent,
    ListVariableComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    SkModule,
    StatusColorPipeModule,
    StatusPipeModule,
    DateMomentPipeModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    PickerModule,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    DateMomentPipeModule
  ],
  providers: []
})
export class CampaignModule {
}
