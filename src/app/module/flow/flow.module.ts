import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FlowRoutingModule} from './flow-routing.module';
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
import {MatSelectModule} from '@angular/material/select';
import {DateMomentPipeModule} from '../../pipe/date-moment.pipe';
import {StatusColorPipeModule} from './pipe/label-status-color.pipe';
import {FormComponent} from './form/form.component';
// import {ReactFlowWrapperComponent} from '../../component/reactflow/ReactFlowWrapperComponent';
import {DialogComponent} from './dialog/dialog.component';
import {HistoryListComponent} from './history-list/history-list.component';
import {HistoryDialogComponent} from './history-dialog/history-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {VexPageLayoutComponent} from "@vex/components/vex-page-layout/vex-page-layout.component";
import {VexPageLayoutHeaderDirective} from "@vex/components/vex-page-layout/vex-page-layout-header.directive";
import {VexPageLayoutContentDirective} from "@vex/components/vex-page-layout/vex-page-layout-content.directive";

@NgModule({
  declarations: [
    ListComponent,
    FormComponent,
    // ReactFlowWrapperComponent,
    DialogComponent,
    HistoryListComponent,
    HistoryDialogComponent
  ],
  imports: [
    CommonModule,
    FlowRoutingModule,
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
    DateMomentPipeModule,
    StatusColorPipeModule,
    MatProgressSpinnerModule,
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
  ]
})
export class FlowModule {
}
