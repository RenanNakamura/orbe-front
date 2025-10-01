import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { ListComponent } from './list/list.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FormComponent } from './form/form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SkModule } from '../sk/sk.module';
import { StatusColorPipeModule } from './pipe/label-status-color.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';

@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    TemplateRoutingModule,
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
    PickerModule,
    MatProgressSpinnerModule,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    VexPageLayoutComponent
  ]
})
export class TemplateModule {}
