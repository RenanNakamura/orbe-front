import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {AddConditionComponent} from './add-condition/add-condition.component';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxMaskPipe, provideNgxMask} from 'ngx-mask';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {AddContactInListComponent} from './add-contact-in-list/add-contact-in-list.component';
import {SelectContactListComponent} from './select-contact-list/select-contact-list.component';
import {VexPageLayoutComponent} from '@vex/components/vex-page-layout/vex-page-layout.component';
import {VexPageLayoutContentDirective} from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import {EmbeddedSignupFacebookComponent} from './facebook/embedded-signup-facebook.component';
import {UploadFileComponent} from './upload-file/upload-file.component';
import {FileUploadComponent} from './image-upload/file-upload.component';
import {TemplateMessageComponent} from './template-message/template-message.component';
import {InfoErrorDialogComponent} from "./info-error-dialog/info-error-dialog.component";
import {InputDialogComponent} from "./input-dialog/input-dialog.component";

@NgModule({
  declarations: [
    QuestionDialogComponent,
    SelectContactListComponent,
    AddContactInListComponent,
    TemplateMessageComponent,
    InputDialogComponent,
    UploadFileComponent,
    AddConditionComponent,
    InfoErrorDialogComponent,
    FileUploadComponent,
    // MessageBubbleComponent,
    EmbeddedSignupFacebookComponent,
    // StarContainerComponent
  ],
  exports: [
    QuestionDialogComponent,
    SelectContactListComponent,
    AddContactInListComponent,
    TemplateMessageComponent,
    InputDialogComponent,
    UploadFileComponent,
    AddConditionComponent,
    InfoErrorDialogComponent,
    FileUploadComponent,
    // MessageBubbleComponent,
    EmbeddedSignupFacebookComponent,
    // StarContainerComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxMaskPipe,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective
  ],
  providers: [provideNgxMask()]
})
export class SkModule {
}
