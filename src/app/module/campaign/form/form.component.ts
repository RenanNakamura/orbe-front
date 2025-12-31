import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {stagger80ms} from '@vex/animations/stagger.animation';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {scaleIn400ms} from '@vex/animations/scale-in.animation';
import {fadeInRight400ms} from '@vex/animations/fade-in-right.animation';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {SelectedFile} from '../../sk/upload-file/upload-file.component';
import {
  ColumnType,
  CreateCampaign,
  isParameterTypeMedia,
  Parameter,
  ParameterComponent,
  ParameterType
} from '../../../model/Campaign';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {TemplateService} from '../../../service/template/template.service';
import {
  Body,
  Button,
  Footer,
  Format,
  Header,
  isFormatMedia,
  isMediaType,
  Status,
  Template,
  Type
} from '../../../model/Template';
import {Observable, ReplaySubject} from 'rxjs';
import {Page} from '../../../model/sk/Page';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment-timezone';
import {CampaignService} from '../../../service/campaign/campaign.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../service/storage/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {AddConditionComponent, Field} from '../../sk/add-condition/add-condition.component';
import {ContactService} from '../../../service/contact/contact.service';
import {Channel} from '../../../model/Channel';
import {FileUtil} from '../../../util/file.util';
import {LoadingService} from '../../../service/sk/loading.service';
import {AlertService} from '../../../service/sk/alert.service';
import {MatMenuTrigger} from '@angular/material/menu';

export enum SendType {
  IMMEDIATELY = 'IMMEDIATELY',
  SCHEDULING = 'SCHEDULING'
}

export enum TargetAudienceType {
  FILE = 'FILE',
  FILTER = 'FILTER'
}

export enum Operation {
  ANY = 'ANY',
  ALL = 'ALL'
}

@Component({
  selector: 'vex-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class FormComponent implements OnInit {

  formStep1: UntypedFormGroup;
  formStep2: UntypedFormGroup;
  formStep3: UntypedFormGroup;

  sendTypes = SendType;
  targetAudienceTypes = TargetAudienceType;
  operations = Operation;
  selectedTargetAudienceFile: SelectedFile;
  amountOfRecords = 0;
  templateFilter = new UntypedFormControl();

  templates: ReplaySubject<Template[]> = new ReplaySubject<Template[]>(1);
  template: Template;

  componentHeader: Header;
  componentBody: Body;
  componentFooter: Footer;
  componentButton: Button;
  selectedFile: File;
  selectedFileUrl: string;
  channels: Channel[];
  selectedChannel: Channel;
  isLoading = false;

  constructor(private _fb: UntypedFormBuilder,
              private _service: CampaignService,
              private _storageService: StorageService,
              private _router: Router,
              private translate: TranslateService,
              private _templateService: TemplateService,
              private _contactService: ContactService,
              private _activatedRoute: ActivatedRoute,
              private _dialog: MatDialog,
              private _loadingService: LoadingService,
              private _cdr: ChangeDetectorRef,
              private _alert: AlertService) {
  }

  ngOnInit(): void {
    this._activatedRoute
      .data
      .subscribe(param => {
        this.channels = param?.['channels']?.content;
      });

    this.initFormStep1();
    this.initFormStep2();
    this.initFormStep3();
  }

  get strategyType() {
    return this.formStep2.get('type')?.value;
  }

  get columns(): UntypedFormArray {
    return this.formStep2?.get('columns') as UntypedFormArray;
  }

  get parameters(): UntypedFormArray {
    return this.formStep3?.get('parameters') as UntypedFormArray;
  }

  get conditions(): UntypedFormArray {
    return this.formStep2.get('conditions') as UntypedFormArray;
  }

  get headerParameters() {
    return this.parameters.controls.filter(param => this.isParameterHeader(param));
  }

  get bodyParameters() {
    return this.parameters.controls.filter(param => this.isParameterBody(param));
  }

  onGetSendTypeI18n(type: SendType): string {
    switch (type) {
      case SendType.SCHEDULING:
        return 'send-type.scheduling';
      default:
        return 'send-type.immediately';
    }
  }

  onGetOperationI18n(operation: Operation): string {
    return this.translate.instant(`contact-filter.operation-${operation.toLowerCase()}`);
  }

  onGetParameterHint(index: number): string {
    const params = {
      parameter: index + 1,
    };
    return this.translate.instant('campaign.parameter.hint', params);
  }

  onGetParameterError(index: number): string {
    const params = {
      parameter: index + 1,
    };
    return this.translate.instant('campaign.parameter.required', params);
  }

  onGetLabelColumn(type: ColumnType): string {
    return type.toLowerCase();
  }

  onGetLabelColumnRequired(type: ColumnType): string {
    return `${type.toLowerCase()}.required`;
  }

  onGetTargetAudienceTypeI18n(type: TargetAudienceType): string {
    switch (type) {
      case TargetAudienceType.FILE:
        return 'target-audience-type.file';
      default:
        return 'target-audience-type.filter';
    }
  }

  onGetFieldI18n(field: Field): string {
    return this.translate.instant(`contact-filter.field-${field.toLowerCase()}`);
  }

  onGetTypeI18n(type: Type): string {
    return this.translate.instant(`contact-filter.type-${type.toLowerCase()}`);
  }

  onAddCondition() {
    this._dialog.open(AddConditionComponent, {width: '800px'})
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          const condition = this._fb.group({
            field: [result.field, Validators.required],
            type: [result.type, Validators.required],
            value: [result?.value?.id, Validators.required],
            valueDescription: [result?.value?.description],
          });

          this.conditions.push(condition);
          this._cdr.detectChanges();
          this.loadAmountOfRecords();
        }
      });

  }

  isScheduling(): boolean {
    return this.formStep1.get('type')?.value === SendType.SCHEDULING;
  }

  isStrategyFile(): boolean {
    return this.formStep2.get('type')?.value === TargetAudienceType.FILE;
  }

  onChangeSelectedTargetAudienceFile(selectedFile: SelectedFile) {
    this.clearFileControl();
    this.selectedTargetAudienceFile = selectedFile;
    this.amountOfRecords = selectedFile?.amountOfRecords || 0;
    this.addFileControl(selectedFile);
  }

  onGetTemplateHeader() {
    return this.componentHeader;
  }

  onGetTemplateBody() {
    return this.componentBody?.text;
  }

  onGetTemplateFooter() {
    return this.componentFooter?.text;
  }

  onGetVariableLabel(index: number): string {
    return `{{${index + 1}}}`;
  }

  onSelectVariable(item: { label: string, value: string },
                   parameter: AbstractControl,
                   input: HTMLInputElement,
                   trigger: MatMenuTrigger) {
    const cursorPosition = input?.selectionStart || 0;
    const text = parameter.get('text').value;
    const newText = text.substring(0, cursorPosition) + item.value + text.substring(cursorPosition);

    parameter.get('text').setValue(newText);

    trigger.closeMenu();
  }

  onSelectEmoji(event,
                parameter: AbstractControl,
                input: HTMLInputElement,
                trigger: MatMenuTrigger) {
    const emoji = event?.emoji?.native;
    const cursorPosition = input?.selectionStart || 0;
    const text = parameter.get('text').value;
    const newText = text.substring(0, cursorPosition) + emoji + text.substring(cursorPosition);

    parameter.get('text').setValue(newText);

    trigger.closeMenu();
  }

  isTemplateSelected() {
    return !!this.formStep3.get('template').value;
  }

  isParameterHeader(parameter: any) {
    return parameter.get('component').value === ParameterComponent.HEADER;
  }

  isParameterBody(parameter: any) {
    return parameter.get('component').value === ParameterComponent.BODY;
  }

  isParameterFormatEquals(parameter: any, parameterType: string) {
    return parameter?.get('type')?.value === parameterType;
  }

  isParameterFormatNotEquals(parameter: any, parameterType: string) {
    return parameter?.get('type')?.value !== parameterType;
  }

  onGetTemplateButton() {
    return this.componentButton;
  }

  onRemoveCondition(i: number) {
    this.conditions.removeAt(i);
    this.loadAmountOfRecords();
  }

  onGetSelectedFileUrl() {
    return this.selectedFileUrl;
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.selectedFileUrl = '';

    if (file) {
      this.selectedFileUrl = URL.createObjectURL(file);
    }
  }

  async onSubmit() {
    if (this.formStep1.valid && this.formStep2.valid && this.formStep3.valid && !this.isLoading) {
      try {
        this.isLoading = true;
        const campaignName = this.formStep1.get('name').value;
        const phoneNumberIdValue = this.selectedChannel.phoneNumberId;
        const channelIdValue = this.selectedChannel.id;
        const scheduled = this.isScheduling() ? this.buildScheduling() : null;
        const strategy = this.formStep2.value;
        const paramValues = this.formStep3.get('parameters').value as Parameter[];

        if (this.isStrategyFile() && this.selectedTargetAudienceFile?.file) {
          try {
            const storage = await this._storageService.upload(this.selectedTargetAudienceFile.file);
            strategy.filename = storage.filename;
          } catch (e) {
            await this._alert.error(e?.message);
            throw new Error(e);
          }
        }

        if (this?.selectedFile && !!paramValues.find(p => isParameterTypeMedia(p.type))) {
          const storage = await this._storageService.upload(this.selectedFile);

          paramValues
            .filter(p => isParameterTypeMedia(p.type))
            .forEach(p => {
              p.fileName = this.selectedFile?.name;
              p.fileNameStored = storage.filename;
            });

          this.template
            ?.components
            ?.filter(c => c.type === Type.HEADER && isFormatMedia((c as Header)?.format))
            ?.forEach(c => {
              const header = c as Header;
              header.fileNameOriginal = this.selectedFile?.name;
              header.fileNameStored = storage.filename;
            });
        }

        const campaign: CreateCampaign = {
          name: campaignName,
          scheduling: scheduled,
          importStrategy: strategy,
          template: this.template,
          parameters: paramValues,
          phoneNumberId: phoneNumberIdValue,
          channelId: channelIdValue,
        };

        await this._service.create(campaign);

        this._router.navigate(['campaign']);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private initFormStep1() {
    this.formStep1 = this._fb.group({
      name: ['', Validators.required],
      type: [SendType.IMMEDIATELY, Validators.required],
      selectedChannel: [null, Validators.required],
    });

    this.formStep1.get('selectedChannel')
      .valueChanges
      .subscribe(
        value => {
          this.initFormStep3();

          this.selectedChannel = value;
          this.getTemplates('')
            .subscribe(page => {
              this.templates.next(page.content);
            });
        }
      );

    this.formStep1.get('type')
      .valueChanges
      .subscribe(value => {
        if (this.isScheduling()) {
          this.formStep1.addControl('date', this._fb.control(new Date(), Validators.required));
          this.formStep1.addControl('time', this._fb.control('00:00', Validators.required));
        } else {
          this.formStep1.removeControl('date');
          this.formStep1.removeControl('time');
        }
      });
  }

  private initFormStep2() {
    this.formStep2 = this._fb.group({
      type: [TargetAudienceType.FILE, Validators.required],
    });

    this.addFileControl();

    this.formStep2.get('type')
      .valueChanges
      .subscribe(type => {
        if (type === TargetAudienceType.FILTER) {
          this.clearFileControl();
          this.addFilterControl();
        }

        if (type === TargetAudienceType.FILE) {
          this.clearFilterControl();
          this.addFileControl();
        }

        this.amountOfRecords = 0;
      });
  }

  private initFormStep3() {
    this.formStep3 = this._fb.group({
      template: [null, Validators.required],
      parameters: this._fb.array([])
    });

    this.templateFilter
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        this.getTemplates(value)
          .subscribe(page => {
            this.templates.next(page.content);
          });
      });

    this.formStep3.get('template')
      .valueChanges
      .subscribe(async value => {
        this._templateService.get(value)
          .subscribe(async template => {
            this.parameters.clear();
            this.parameters.clearValidators();

            this.template = template;
            this.componentHeader = template?.components?.find(c => c.type === Type.HEADER) as Header;
            this.componentBody = template?.components?.find(c => c.type === Type.BODY) as Body;
            this.componentFooter = template?.components?.find(c => c.type === Type.FOOTER) as Footer;
            this.componentButton = template?.components?.find(c => c.type === Type.BUTTONS) as Button;
            this.selectedFile = null;
            this.selectedFileUrl = '';

            try {
              await this.buildHeaderParameters();
            } catch (e) {
              console.error(`Error when build header parameters`, e);
            }

            this.buildBodyParameters();
          });
      });
  }

  private addFileControl(selectedFile?: SelectedFile) {
    this.formStep2.addControl('filename', this._fb.control(selectedFile?.file?.name, Validators.required));
    this.formStep2.addControl('columns', this._fb.array(this.buildColumnsFileFormGroup()));
  }

  private clearFileControl() {
    this.selectedTargetAudienceFile = null;
    this.formStep2.removeControl('filename');
    this.formStep2.removeControl('columns');
  }

  private addFilterControl() {
    this.formStep2.addControl('operation', this._fb.control(Operation.ALL, Validators.required));
    this.formStep2.addControl('conditions', this._fb.array([], Validators.required));

    this.formStep2.get('operation')
      .valueChanges
      .subscribe(operation => {
        this.loadAmountOfRecords();
      });
  }

  private clearFilterControl() {
    this.formStep2.removeControl('operation');
    this.formStep2.removeControl('conditions');
  }

  private buildColumnsFileFormGroup() {
    const columns = [
      {
        type: ColumnType.NAME,
        required: true
      },
      {
        type: ColumnType.PHONE,
        required: true
      },
      {
        type: ColumnType.EMAIL,
        required: false
      }
    ];

    return columns.map(column => {
      const validators = column?.required ? [Validators.required] : [];
      return this._fb.group({
        type: [column?.type, Validators.required],
        index: ['', validators],
      });
    });
  }

  private getTemplates(search: string): Observable<Page<Template>> {
    return this._templateService.list(
      {
        name: search,
        channelId: this.selectedChannel?.id,
        status: Status.APPROVED
      }
    );
  }

  private async buildHeaderParameters() {
    if (isMediaType(this.componentHeader.format)) {
      this._loadingService.setLoading(true);

      this._storageService.download(this.componentHeader.fileNameStored)
        .subscribe({
          next: (blob) => {
            const file = FileUtil.blobToFile(blob, this.componentHeader.fileNameOriginal);

            this.onFileSelected(file);

            const newParameter = {
              component: ParameterComponent.HEADER,
              type: this.mapToParameterFormat(this.componentHeader.format),
              number: 0,
              fileNameStored: this.componentHeader.fileNameStored,
              fileName: this.componentHeader.fileNameOriginal
            };

            this.parameters.push(this._fb.group(newParameter));

            this._loadingService.setLoading(false);
            this._cdr.detectChanges();
          },
          error: (err) => {
            this._loadingService.setLoading(false);
          }
        });
    } else {
      this.componentHeader
        ?.example
        ?.headerText
        ?.forEach((text, i) => {
          const newParameter = {
            component: ParameterComponent.HEADER,
            type: this.mapToParameterFormat(this.componentHeader.format),
            number: i,
            text: ['', Validators.required],
          };
          this.parameters.push(this._fb.group(newParameter));
        });
    }
  }

  private buildBodyParameters() {
    this.componentBody
      ?.example
      ?.bodyText
      ?.forEach((text, i) => {
        const newParameter = {
          component: ParameterComponent.BODY,
          type: ParameterType.TEXT,
          number: i,
          text: ['', Validators.required],
        };
        this.parameters.push(this._fb.group(newParameter));
      });
  }

  private mapToParameterFormat(format: Format) {
    switch (format) {
      case Format.IMAGE:
        return ParameterType.IMAGE;
      case Format.DOCUMENT:
        return ParameterType.DOCUMENT;
      case Format.VIDEO:
        return ParameterType.VIDEO;
      case Format.TEXT:
        return ParameterType.TEXT;
      default:
        console.error('Error when select parameterType');
    }
  }

  private buildScheduling() {
    const date = this.formStep1.get('date').value;
    const time = this.formStep1.get('time').value;
    const times = time.split(':');

    return moment(date)
      .set({
        hour: times[0],
        minute: times[1],
        second: 0,
      })
      .tz(moment.tz.guess(true))
      .format();
  }

  private loadAmountOfRecords() {
    if (!this.conditions?.value?.length) {
      this.amountOfRecords = 0;
      return;
    }

    const param = {
      operation: this.formStep2.get('operation').value,
      conditions: this.conditions.value
    };

    this._contactService.list(param)
      .subscribe(contacts => {
        this.amountOfRecords = contacts.totalElements || 0;
        this._cdr.detectChanges();
      });
  }

  mapToComponentFormat(parameter: AbstractControl) {
    switch (parameter.get('type').value) {
      case 'IMAGE':
        return Format.IMAGE;
      case 'DOCUMENT':
        return Format.DOCUMENT;
      case 'VIDEO':
        return Format.VIDEO;
      case 'TEXT':
        return Format.TEXT;
      default:
        console.error('Error when select componentType');
    }
  }

}
