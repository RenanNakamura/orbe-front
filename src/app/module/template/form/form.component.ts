import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  Body,
  Button,
  ButtonAction,
  ButtonType,
  Category,
  Footer,
  Format,
  Header,
  isMediaType,
  ItemButton,
  Template,
  Type
} from '../../../model/Template';
import { TemplateService } from '../../../service/template/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { distinctUntilChanged } from 'rxjs/operators';
import { Channel } from '../../../model/Channel';
import { StorageService } from 'src/app/service/storage/storage.service';
import { CreateTemplateStrategy } from './strategy/CreateTemplateStrategy';
import { CreateCustomTemplateStrategy } from './strategy/CreateCustomTemplateStrategy';
import { TemplateContext } from './strategy/TemplateContext';
import { FileUtil } from '../../../util/file.util';
import { LoadingService } from '../../../service/sk/loading.service';
import languages from 'src/assets/json/language.json';
import { LanguageUtil } from '../../../util/language.util';
import { MatMenuTrigger } from '@angular/material/menu';

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
  actions = ButtonAction;
  buttonsType = ButtonType;

  maxNameLength = 512;
  maxHeaderTextLength = 60;
  maxBodyTextLength = 1024;
  maxButtonTextLength = 25;
  maxButtonPhoneNumberLength = 20;
  maxButtonUrlLength = 2000;
  isLoading = false;
  selectedFile: File | null = null;
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
    private _loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((param) => {
      this.channels = param?.['channels']?.content;
      this.initForm(param?.['data']);
    });
  }

  get itensbuttonsControls() {
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

  get formControlHeaderFormat(): UntypedFormControl {
    return this.form?.get('header.format') as UntypedFormControl;
  }

  get headerFormat(): Format {
    return this.form?.get('header.format').value as Format;
  }

  set setHeaderText(text: string) {
    this.form?.get('header.text')?.setValue(text);
  }

  set setHeaderHandle(headerHandle: string) {
    this.form?.get('header.example.headerHandle')?.setValue(headerHandle);
  }

  onNameLength(): number {
    return this.form?.get('name')?.value?.length;
  }

  onBodyTextLength(): number {
    const body = this.form?.get('body');
    return body.get('text')?.value?.length;
  }

  onFooterTextLength(): number {
    const footer = this.form?.get('footer');
    return footer.get('text')?.value?.length;
  }

  onSelectEmoji(event, trigger: MatMenuTrigger) {
    const emoji = event?.emoji?.native;
    const index = this.textAreaBody.nativeElement.selectionStart;
    const text = this.bodyText.value;
    const newText = text.substr(0, index) + emoji + text.substr(index);

    this.bodyText.setValue(newText);
    trigger.closeMenu();
  }

  onButtonTextLength(index: number): number {
    const buttonsArray = this.form?.get('button.buttons') as UntypedFormArray;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const buttonText = buttonGroup.get('text')?.value;
    return buttonText?.length;
  }

  onButtonPhoneNumberLength(index: number): number {
    const buttonsArray = this.form?.get('button.buttons') as UntypedFormArray;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const phoneNumber = buttonGroup.get('phoneNumber')?.value;
    return phoneNumber?.length;
  }

  onButtonUrlLength(index: number): number {
    const buttonsArray = this.form?.get('button.buttons') as UntypedFormArray;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const url = buttonGroup.get('url')?.value;
    return url?.length;
  }

  onHeaderTextLength(): number {
    const body = this.form?.get('header');
    return body.get('text')?.value?.length;
  }

  onGetHeaderValue() {
    return this.form?.get('header').value as Header;
  }

  onGetBodyValue() {
    const body = this.form?.get('body');
    return body.get('text')?.value;
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

  isHeaderMidia(): boolean {
    const header = this.form?.get('header');
    return (
      header.get('format').value === Format.IMAGE ||
      header.get('format').value === Format.VIDEO ||
      header.get('format').value === Format.DOCUMENT
    );
  }

  hasRejectedReason(): boolean {
    return (
      this.form.get('status').value === 'REJECTED' ||
      (this.form?.get('rejectedReason').value &&
        this.form?.get('rejectedReason').value !== 'NONE')
    );
  }

  isButtonPhoneNumber(index: number): boolean {
    const buttonsArray = this.form?.get('button.buttons') as UntypedFormArray;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const type = buttonGroup.get('type')?.value;
    return type === ButtonType.PHONE_NUMBER;
  }

  isButtonUrl(index: number): boolean {
    const buttonsArray = this.form?.get('button.buttons') as UntypedFormArray;
    const buttonGroup = buttonsArray.at(index) as UntypedFormGroup;
    const type = buttonGroup.get('type')?.value;
    return type === ButtonType.URL;
  }

  hasHeaderVariable(): boolean {
    return !!this.exampleHeaderText?.length;
  }

  hasBodyVariable(): boolean {
    return !!this.exampleBodyText?.length;
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.selectedFileUrl = '';

    if (file) {
      this.selectedFileUrl = URL.createObjectURL(file);
    }
  }

  onGetSelectedFileUrl() {
    return this.selectedFileUrl;
  }

  onGetLanguageName(): string {
    return LanguageUtil.getLanguageName(this.form?.get('language').value);
  }

  private initForm(template: Template) {
    const header = template?.components?.find(
      (c) => c.type === Type.HEADER
    ) as Header;
    const body = template?.components?.find(
      (c) => c.type === Type.BODY
    ) as Body;
    const footer = template?.components?.find(
      (c) => c.type === Type.FOOTER
    ) as Footer;
    const button = template?.components?.find(
      (c) => c.type === Type.BUTTONS
    ) as Button;
    const buttons =
      button?.buttons?.map((itemButton) =>
        this.buildFormGroupButton(itemButton.type, itemButton)
      ) || [];
    const headerText =
      header?.example?.headerText?.map((text) =>
        this.buildVariableFormGroup(text)
      ) || [];
    const bodyText =
      body?.example?.bodyText?.map((text) =>
        this.buildVariableFormGroup(text)
      ) || [];

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
          headerHandle: ''
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
        action: [button?.action || ButtonAction.NONE],
        buttons: this._fb.array(buttons)
      })
    });

    this.buildButtons(button?.action, button?.buttons);

    this.form.get('name').valueChanges.subscribe((name) => {
      this.form
        .get('name')
        .setValue(name.replace(/ /g, '_'), { emitEvent: false });
    });

    this.headerText.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((text) => this.processHeaderText(text));

    this.bodyText.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((text) => this.processBodyText(text));

    this.form.get('button.action').valueChanges.subscribe((action) => {
      this.itensbuttonsControls.clear();
      this.buildButtons(action);
    });

    this.formControlHeaderFormat.valueChanges.subscribe((value) => {
      this.onFormatChange();
    });
  }

  private loadImage(fileNameOriginal: string, fileNameStored: string) {
    if (
      !this.isStringEmpty(fileNameOriginal) &&
      !this.isStringEmpty(fileNameStored)
    ) {
      this._loadingService.setLoading(true);
      this.fileNameStored = fileNameStored;

      this._storageService.download(fileNameStored).subscribe({
        next: (blob) => {
          const file = FileUtil.blobToFile(blob, fileNameOriginal);
          this.onFileSelected(file);
          this._loadingService.setLoading(false);
        },
        error: (err) => {
          this._loadingService.setLoading(false);
        }
      });
    }
  }

  private isStringEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  onFormatChange() {
    this.setHeaderText = '';
    this.setHeaderHandle = '';

    if (this.selectedFileUrl) {
      URL.revokeObjectURL(this.selectedFileUrl);
      this.selectedFileUrl = '';
    }

    if (this.selectedFile) {
      this.selectedFile = null;
    }
  }

  private buildButtons(action: ButtonAction, buttons?: ItemButton[]) {
    switch (action) {
      case ButtonAction.QUICK_REPLY:
        const buttonsToAdd = 3 - (buttons ? buttons.length : 0);

        for (let i = 0; i < buttonsToAdd; i++) {
          this.itensbuttonsControls.push(
            this.buildFormGroupButton(ButtonType.QUICK_REPLY)
          );
        }
        break;
      case ButtonAction.CALL_TO_ACTION:
        if (buttons?.length === 2) {
          return;
        }

        if (buttons?.length) {
          const hasPhoneNumberButton = !!buttons.find(
            (item) => item.type === ButtonType.PHONE_NUMBER
          );
          if (!hasPhoneNumberButton) {
            this.itensbuttonsControls.push(
              this.buildFormGroupButton(ButtonType.PHONE_NUMBER)
            );
          }

          const hasUrlButton = !!buttons.find(
            (item) => item.type === ButtonType.URL
          );
          if (!hasUrlButton) {
            this.itensbuttonsControls.push(
              this.buildFormGroupButton(ButtonType.URL)
            );
          }
          return;
        }

        this.itensbuttonsControls.push(
          this.buildFormGroupButton(ButtonType.PHONE_NUMBER)
        );
        this.itensbuttonsControls.push(
          this.buildFormGroupButton(ButtonType.URL)
        );
        break;
    }
  }

  private buildFormGroupButton(type?: ButtonType, itemButton?: ItemButton) {
    return this._fb.group({
      type: [type || ''],
      text: [itemButton?.text || ''],
      phoneNumber: [itemButton?.phoneNumber || ''],
      url: [itemButton?.url || '']
    });
  }

  private insertVariable(componentName: string, index: number) {
    const text = `${this.form?.get(componentName)?.value} {{${index}}}`;
    this.form?.get(componentName)?.patchValue(text);
  }

  private processHeaderText(text: string) {
    const variables = this.getVariables(text);

    if (variables?.length > 1) {
      const maxVariable = Math.max(...variables);

      text = text.replace(`{{${maxVariable}}}`, '');
      this.headerText.setValue(text, { emitEvent: false });

      return;
    }

    if (variables.length) {
      const regex = /\{\{(\d+)}}/g;
      this.addVariableHeader();
      text = text.replace(regex, `{{${this.exampleHeaderText?.length}}}`);
      this.headerText.setValue(text, { emitEvent: false });
    }

    if (!variables.length) {
      this.clearVariableHeader();
    }
  }

  private processBodyText(text: string) {
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
          this.bodyText.setValue(text, { emitEvent: false });
        }
      });
    }

    if (!variables.length) {
      this.clearVariableBody();
    }
  }

  private addVariableHeader() {
    if (!this.hasHeaderVariable()) {
      const variable = this.buildVariableFormGroup();
      this.exampleHeaderText?.push(variable);
    }
  }

  private addVariableBody() {
    const variable = this.buildVariableFormGroup();
    this.exampleBodyText?.push(variable);
  }

  private clearVariableHeader() {
    this.exampleHeaderText?.clear();
  }

  private clearVariableBody() {
    this.exampleBodyText?.clear();
  }

  private buildVariableFormGroup(text?: string) {
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
    if (this.form.valid && !this.isLoading) {
      try {
        this.isLoading = true;

        const context: TemplateContext = {
          form: this.form,
          selectedFile: this.selectedFile
        };

        await this.getStrategy().execute(context);

        this._router.navigate(['template']);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private getStrategy(): CreateTemplateStrategy {
    return new CreateCustomTemplateStrategy(this._service);
  }
}
