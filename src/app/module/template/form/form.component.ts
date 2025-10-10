import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  FormArray,
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  Body,
  Button,
  ButtonType,
  Category,
  Footer,
  Format,
  Header,
  isMediaType,
  ItemButton,
  Status,
  Template,
  Type
} from '../../../model/Template';
import {TemplateService} from '../../../service/template/template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {fadeInRight400ms} from '@vex/animations/fade-in-right.animation';
import {scaleIn400ms} from '@vex/animations/scale-in.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {distinctUntilChanged} from 'rxjs/operators';
import {Channel} from '../../../model/Channel';
import {StorageService} from 'src/app/service/storage/storage.service';
import {FileUtil} from '../../../util/file.util';
import {LoadingService} from '../../../service/sk/loading.service';
import languages from 'src/assets/json/language.json';
import {MatMenuTrigger} from '@angular/material/menu';
import {StringUtil} from "../../../util/string.util";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {WhatsAppService} from "../../../service/whatsapp/whatsapp.service";

@Component({
  selector: 'vex-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms]
})
export class FormComponent implements OnInit {
  @ViewChild('textAreaBody') textAreaBody: ElementRef;

  form: UntypedFormGroup;
  categorys = Category;
  formats = Format;
  buttonsType = ButtonType;

  maxNameLength = 512;
  maxHeaderTextLength = 60;
  maxBodyTextLength = 1024;
  maxButtonTextLength = 25;
  maxButtonPhoneNumberLength = 20;
  maxButtonUrlLength = 2000;
  isLoading = false;
  selectedFile: File | null = null;
  fileChanged: boolean = false;
  selectedFileUrl: string;
  fileNameStored: string;
  channels: Channel[];
  languagesOptions: { language: string; code: string }[] = languages;

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _service: TemplateService,
    private _storageService: StorageService,
    private _activatedRoute: ActivatedRoute,
    private _loadingService: LoadingService,
    private _whatsAppService: WhatsAppService,
  ) {
  }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((param) => {
      this.channels = param?.['channels']?.content;
      this.initForm(param?.['data']);
    });
  }

  get buttons() {
    return this.form.get('button.buttons') as UntypedFormArray;
  }

  get exampleHeaderText(): UntypedFormArray {
    return this.form?.get('header.example.headerText') as UntypedFormArray;
  }

  get headerText(): UntypedFormControl {
    return this.form?.get('header.text') as UntypedFormControl;
  }

  get exampleBodyText(): UntypedFormArray {
    return this.form?.get('body.example.bodyText') as UntypedFormArray;
  }

  get bodyText(): UntypedFormControl {
    return this.form?.get('body.text') as UntypedFormControl;
  }

  get headerFormat(): UntypedFormControl {
    return this.form?.get('header.format') as UntypedFormControl;
  }

  get headerFormatValue(): Format {
    return this.form?.get('header.format').value as Format;
  }

  set setHeaderText(text: string) {
    this.form?.get('header.text')?.setValue(text);
  }

  set setHeaderFileNameStored(filename: string) {
    this.form?.get('header.fileNameStored')?.setValue(filename);
  }

  set setHeaderFileNameOriginal(filename: string) {
    this.form?.get('header.fileNameOriginal')?.setValue(filename);
  }

  set setHeaderHandle(headerHandle: string) {
    this.form?.get('header.example.headerHandle')?.setValue(headerHandle);
  }

  onGetNameLength(): number {
    return this.form?.get('name')?.value?.length;
  }

  onGetBodyTextLength(): number {
    const body = this.form?.get('body');
    return body.get('text')?.value?.length;
  }

  onGetFooterTextLength(): number {
    const footer = this.form?.get('footer');
    return footer.get('text')?.value?.length;
  }

  onSelectEmoji(event, trigger: MatMenuTrigger) {
    const emoji = event?.emoji?.native;
    const index = this.textAreaBody?.nativeElement?.selectionStart;
    const text = this.bodyText?.value;
    const newText = text?.substr(0, index) + emoji + text?.substr(index);

    this.bodyText.setValue(newText);
    trigger.closeMenu();
  }

  onButtonTextLength(index: number): number {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const buttonText = buttonGroup.get('text')?.value;
    return buttonText?.length || 0;
  }

  onButtonPhoneNumberLength(index: number): number {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const phoneNumber = buttonGroup.get('phoneNumber')?.value;
    return phoneNumber?.length || 0;
  }

  onButtonUrlLength(index: number): number {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const url = buttonGroup.get('url')?.value;
    return url?.length || 0;
  }

  onDropButton(event: CdkDragDrop<FormGroup[]>) {
    const buttons = this.buttons as FormArray;
    if (!buttons) return;

    if (event.previousIndex === event.currentIndex) return;

    const moved = buttons.at(event.previousIndex);
    buttons.removeAt(event.previousIndex);
    buttons.insert(event.currentIndex, moved);

    buttons.markAsDirty();
    this.form.markAsDirty();
  }

  onHeaderTextLength(): number {
    return this.headerText?.value?.length;
  }

  onGetHeaderValue() {
    return this.form?.get('header').value as Header;
  }

  onGetBodyValue() {
    return this.bodyText?.value;
  }

  onGetFooterValue() {
    const footer = this.form?.get('footer');
    return footer.get('text')?.value;
  }

  onGetButtonValue() {
    return this.form?.get('button')?.value;
  }

  onCancel() {
    this._router.navigate(['template']);
  }

  onAddHeaderVariable() {
    if (!this.hasHeaderVariable()) {
      this.insertVariable('header.text', this.exampleHeaderText?.length + 1);
    }
  }

  onAddBodyVariable() {
    this.insertVariable('body.text', this.exampleBodyText?.length + 1);
  }

  onGetVariableLabel(index: number): string {
    return `{{${index + 1}}}`;
  }

  isMarketing(): boolean {
    return this.form?.get('category')?.value === Category.MARKETING;
  }

  isUtility(): boolean {
    return this.form?.get('category')?.value === Category.UTILITY;
  }

  isAuthentication(): boolean {
    return this.form?.get('category')?.value === Category.AUTHENTICATION;
  }

  isHeaderFormatText(): boolean {
    const header = this.form?.get('header');
    return header.get('format').value === Format.TEXT;
  }

  isHeaderMedia(): boolean {
    const header = this.onGetHeaderValue();
    return (
      header?.format === Format.IMAGE ||
      header?.format === Format.VIDEO ||
      header?.format === Format.DOCUMENT
    );
  }

  hasRejectedReason(): boolean {
    return (this.form.get('status').value === 'REJECTED' || (this.form?.get('rejectedReason').value && this.form?.get('rejectedReason').value !== 'NONE'));
  }

  isButtonPhoneNumber(index: number): boolean {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const type = buttonGroup.get('type')?.value;
    return type === ButtonType.PHONE_NUMBER;
  }

  isButtonQuickReply(index: number): boolean {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const type = buttonGroup.get('type')?.value;
    return type === ButtonType.QUICK_REPLY;
  }

  isButtonUrl(index: number): boolean {
    const buttonsArray = this.buttons;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const type = buttonGroup.get('type')?.value;
    return type === ButtonType.URL;
  }

  isButtonTypeDisabled(type: ButtonType): boolean {
    if (type === ButtonType.PHONE_NUMBER) {
      return this.hasButtonType(type);
    }

    if (type === ButtonType.URL) {
      const buttons = this.buttons?.value?.filter((btn) => btn.type === type);
      return buttons?.length >= 2;
    }
    return false;
  }

  hasButtonType(type: ButtonType): boolean {
    return this.buttons?.value?.some((btn) => btn.type === type);
  }

  hasHeaderVariable(): boolean {
    return !!this.exampleHeaderText?.length;
  }

  hasBodyVariable(): boolean {
    return !!this.exampleBodyText?.length;
  }

  onChangeButtonType(index: number): void {
    const buttonGroup = this.buttons.at(index) as UntypedFormGroup;
    const currentType = buttonGroup.get('type')?.value;
    const currentText = buttonGroup.get('text')?.value;

    buttonGroup.reset({
      type: currentType,
      text: currentText || ''
    });

    this.applyButtonValidators(currentType, buttonGroup);
  }

  onFileSelected(file: File, isChanged: boolean): void {
    this.selectedFile = file;
    this.selectedFileUrl = '';

    this.fileChanged = isChanged;

    if (file) {
      this.selectedFileUrl = URL.createObjectURL(file);
    }
  }

  onGetSelectedFileUrl() {
    return this.selectedFileUrl;
  }

  onAddButton() {
    if (this.isButtonLimit()) {
      return;
    }

    this.buttons.push(this.buildFormButton(ButtonType.QUICK_REPLY));
  }

  isButtonLimit() {
    return this.buttons?.length >= 10;
  }

  onDeleteButton(index: number) {
    this.buttons?.removeAt(index);
  }

  private initForm(template: Template) {
    const header = template?.components?.find((c) => c.type === Type.HEADER) as Header;
    const body = template?.components?.find((c) => c.type === Type.BODY) as Body;
    const footer = template?.components?.find((c) => c.type === Type.FOOTER) as Footer;
    const button = template?.components?.find((c) => c.type === Type.BUTTONS) as Button;
    const buttons = button?.buttons?.map((itemButton) => this.buildFormButton(itemButton.type, itemButton)) || [];
    const headerText = header?.example?.headerText?.map((text) => this.buildFormVariable(text)) || [];
    const headerHandle = header?.example?.headerHandle;
    const bodyText = body?.example?.bodyText?.map((text) => this.buildFormVariable(text)) || [];

    if (isMediaType(header?.format)) {
      this.loadImage(header?.fileNameOriginal, header?.fileNameStored);
    }

    this.form = this._fb.group({
      id: template?.id || '',
      name: [template?.name || '', Validators.required],
      channelId: [template?.channelId || '', Validators.required],
      language: [template?.language || '', Validators.required],
      category: [template?.category || Category.MARKETING, Validators.required],
      status: [template?.status],
      rejectedReason: [template?.rejectedReason],
      allowCategoryChange: [true],
      header: this._fb.group({
        type: 'HEADER',
        format: [header?.format || Format.NONE],
        text: [header?.text || ''],
        fileNameOriginal: [header?.fileNameOriginal || ''],
        fileNameStored: [header?.fileNameStored || ''],
        example: this._fb.group({
          headerText: this._fb.array(headerText),
          headerHandle: headerHandle
        })
      }),
      body: this._fb.group({
        type: 'BODY',
        text: [body?.text || '', Validators.required],
        example: this._fb.group({
          bodyText: this._fb.array(bodyText)
        })
      }),
      footer: this._fb.group({
        type: 'FOOTER',
        text: [footer?.text || '']
      }),
      button: this._fb.group({
        type: 'BUTTONS',
        buttons: this._fb.array(buttons)
      })
    });

    this.applyEditPermissions()

    this.form.get('name').valueChanges.subscribe((name) => {
      this.form
        .get('name')
        .setValue(name.replace(/ /g, '_'), {emitEvent: false});
    });

    this.headerText.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((text) => this.handleHeaderVariables(text));

    this.bodyText.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((text) => this.handleBodyVariables(text));

    this.headerFormat
      .valueChanges
      .subscribe((value) => {
        this.changeFormat();
      });
  }

  private applyEditPermissions(): void {
    const status = this.form.get('status')?.value as Status;

    const editableComponents = [Status.APPROVED, Status.PAUSED, Status.REJECTED];
    const fullyEditable = status === Status.REJECTED;

    if (status && !editableComponents.includes(status)) {
      this.form.disable({emitEvent: false});
      return;
    }

    if (status && !fullyEditable) {
      this.form.get('channelId')?.disable({emitEvent: false});
      this.form.get('name')?.disable({emitEvent: false});
      this.form.get('category')?.disable({emitEvent: false});
      this.form.get('language')?.disable({emitEvent: false});
    }
  }

  private applyButtonValidators(currentType: ButtonType, buttonGroup: UntypedFormGroup): void {
    buttonGroup.get('url')?.clearValidators();
    buttonGroup.get('phoneNumber')?.clearValidators();

    if (currentType === ButtonType.URL) {
      buttonGroup.get('url')?.setValidators([Validators.required]);
    }

    if (currentType === ButtonType.PHONE_NUMBER) {
      buttonGroup.get('phoneNumber')?.setValidators([Validators.required,]);
    }

    buttonGroup.get('url')?.updateValueAndValidity();
    buttonGroup.get('phoneNumber')?.updateValueAndValidity();
  }

  private loadImage(fileNameOriginal: string, fileNameStored: string) {
    if (!StringUtil.isStringEmpty(fileNameOriginal) && !StringUtil.isStringEmpty(fileNameStored)) {
      this._loadingService.setLoading(true);
      this.fileNameStored = fileNameStored;

      this._storageService.download(fileNameStored)
        .subscribe({
          next: (blob) => {
            const file = FileUtil.blobToFile(blob, fileNameOriginal);
            this.onFileSelected(file, false);
            this._loadingService.setLoading(false);
          },
          error: (err) => {
            this._loadingService.setLoading(false);
          }
        });
    }
  }

  private changeFormat() {
    this.setHeaderText = '';
    this.setHeaderHandle = '';
    this.setHeaderFileNameStored = '';
    this.setHeaderFileNameOriginal = '';

    if (this.selectedFileUrl) {
      URL.revokeObjectURL(this.selectedFileUrl);
      this.selectedFileUrl = '';
    }

    if (this.selectedFile) {
      this.selectedFile = null;
    }
  }

  private buildFormButton(type: ButtonType, itemButton?: ItemButton) {
    const buttonGroup = this._fb.group({
      type: [type || ''],
      text: [itemButton?.text || '', Validators.required],
      phoneNumber: [itemButton?.phoneNumber || ''],
      url: [itemButton?.url || '']
    });

    this.applyButtonValidators(type, buttonGroup);

    return buttonGroup;
  }

  private insertVariable(componentName: string, index: number) {
    const text = `${this.form?.get(componentName)?.value} {{${index}}}`;
    this.form?.get(componentName)?.patchValue(text);
  }

  private handleHeaderVariables(text: string) {
    const variables = this.getVariables(text);

    if (variables?.length > 1) {
      const maxVariable = Math.max(...variables);

      text = text.replace(`{{${maxVariable}}}`, '');
      this.headerText.setValue(text, {emitEvent: false});

      return;
    }

    if (variables.length) {
      const regex = /\{\{(\d+)}}/g;
      this.addVariableHeader();
      text = text.replace(regex, `{{${this.exampleHeaderText?.length}}}`);
      this.headerText.setValue(text, {emitEvent: false});
    }

    if (!variables.length) {
      this.clearVariableHeader();
    }
  }

  private handleBodyVariables(text: string) {
    const variables = this.getVariables(text);

    if (variables.length) {
      if (variables.length > this.exampleBodyText?.length) {
        const numVariablesToAdd =
          variables.length - this.exampleBodyText?.length;
        for (let i = 0; i < numVariablesToAdd; i++) {
          this.addVariableBody();
        }
        return;
      }

      this.exampleBodyText?.value?.forEach((bodyText, index) => {
        const variable = index + 1;

        if (variables.includes(variable)) {
          return;
        }

        if (!variables.includes(variable)) {
          variables.slice(index, 1);
          this.exampleBodyText?.removeAt(index);
        }
      });

      variables.forEach((value, i) => {
        const newVariables = this.getVariables(text);
        const maxVariable = Math.max(...newVariables);

        if (
          maxVariable === value &&
          maxVariable === i + 1 &&
          newVariables.includes(value - 1)
        ) {
          return;
        }

        if (value > 1 && !newVariables.includes(value - 1)) {
          text = text.replace(`{{${value}}}`, `{{${value - 1}}}`);
          this.bodyText.setValue(text, {emitEvent: false});
        }
      });
    }

    if (!variables.length) {
      this.clearVariableBody();
    }
  }

  private addVariableHeader() {
    if (!this.hasHeaderVariable()) {
      const variable = this.buildFormVariable();
      this.exampleHeaderText?.push(variable);
    }
  }

  private addVariableBody() {
    const variable = this.buildFormVariable();
    this.exampleBodyText?.push(variable);
  }

  private clearVariableHeader() {
    this.exampleHeaderText?.clear();
  }

  private clearVariableBody() {
    this.exampleBodyText?.clear();
  }

  private buildFormVariable(text?: string) {
    return this._fb.control(text || '', [Validators.required]);
  }

  private getVariables(text: string) {
    const regex = /\{\{(\d+)}}/g;
    const matches = text.match(regex);
    const variables = matches
      ? matches.map((match) => parseInt(match.match(/\d+/)[0], 10))
      : [];
    return Array.from(new Set(variables)) || [];
  }

  async onSubmit() {
    console.log(this.form.disabled);
    if (this.form.valid && !this.form.disabled && !this.isLoading) {
      try {
        this.isLoading = true;
        const template = this.form.getRawValue() as Template;

        template.components = [];

        if (this.isHeaderMedia() && this.selectedFile && this.fileChanged) {
          const fileWhatsAppUploaded = await this._whatsAppService.upload(template.channelId, this.selectedFile);
          const fileStorageUploaded = await this._storageService.upload(this.selectedFile);

          this.setHeaderHandle = fileWhatsAppUploaded?.h;
          this.setHeaderFileNameOriginal = this.selectedFile?.name;
          this.setHeaderFileNameStored = fileStorageUploaded?.filename;
        }

        template.components.push(this.form?.get('header').value);
        template.components.push(this.form?.get('body').value);
        template.components.push(this.form?.get('footer').value);
        template.components.push(this.form?.get('button').value);

        !this.form.get('id').value
          ? await this._service.create(template)
          : await this._service.update(template);

        this._router.navigate(['template']);
      } finally {
        this.isLoading = false;
      }
    }
  }

}
