import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WebhookService} from '../../../../service/webhook/webhook.service';
import {Webhook} from '../../../../model/Webhook';
import {environment} from '../../../../../environments/environment';
import icGenerate from '@iconify/icons-ic/refresh';
import icCopy from '@iconify/icons-ic/content-copy';
import {v4 as uuidv4} from 'uuid';

@Component({
    selector: 'vex-webhook',
    templateUrl: './webhook.component.html',
    styleUrls: ['./webhook.component.scss']
})
export class WebhookComponent implements OnInit {

    icClose = icClose;
    icGenerate = icGenerate;
    icCopy = icCopy;

    form: UntypedFormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) private _data: Webhook,
                private _fb: UntypedFormBuilder,
                private _dialogRef: MatDialogRef<WebhookComponent>,
                private _service: WebhookService) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    async onSubmit() {
        if (this.form.valid) {
            !this.form.get('id').value
                ? await this._service.create(this.form.value)
                : await this._service.update(this.form.value);

            this._dialogRef.close();
        }
    }

    onGenerateVerifyToken() {
        const uuid = uuidv4();
        const verifyToken = `${Math.floor(new Date().getTime() / 1000)}${uuid}`;
        this.form.get('verifyToken').setValue(verifyToken);
    }

    async onCopyVerifyToken() {
        await navigator.clipboard.writeText(this.form.get('verifyToken').value);
    }

    private initForm() {
        const link = this._data?.hash ? `${environment.webhook}/api/v1/webhook/${this._data?.hash}` : '';
        this.form = this._fb.group({
            id: [this._data?.id],
            link: [{value: link, disabled: true}],
            verifyToken: [this._data?.verifyToken || '', Validators.required],
        });
    }

}
