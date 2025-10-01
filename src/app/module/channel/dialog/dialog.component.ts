import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import icCopy from '@iconify/icons-ic/content-copy';
import {MatDialogRef} from '@angular/material/dialog';
import {ChannelService} from '../../../service/channel/channel.service';
import {environment} from '../../../../environments/environment';
import {WebhookService} from '../../../service/webhook/webhook.service';

@Component({
    selector: 'vex-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    icClose = icClose;
    icCopy = icCopy;

    form: UntypedFormGroup;

    webhookLink: string;
    webhookVerifyToken: string;
    phoneNumberInfo: any;

    constructor(private _fb: UntypedFormBuilder,
                private _service: ChannelService,
                private _dialogRef: MatDialogRef<DialogComponent>,
                private _webhookService: WebhookService) {
    }

    ngOnInit(): void {
        this.initForm();
        this.loadWebhook();
    }

    async onSubmit() {
        if (this.form.valid) {
            await this._service.create(this.form.value);
            this._dialogRef.close();
        }
    }

    async onCopy(text: string) {
        await navigator.clipboard.writeText(text);
    }

    private initForm() {
        this.form = this._fb.group({
            id: [''],
            name: ['', Validators.required],
            phoneNumberId: ['', [Validators.required]],
            wabaId: ['', [Validators.required]],
            applicationId: ['', [Validators.required]],
            accessToken: ['', [Validators.required]],
        });
    }

    private loadWebhook() {
        this._webhookService.get()
            .subscribe(response => {
                this.webhookLink = `${environment.webhook}/api/v1/webhook/${response?.hash}`;
                this.webhookVerifyToken = response?.verifyToken;
            });
    }

}
