import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Contact} from '../../../model/Contact';
import {ContactService} from '../../../service/contact/contact.service';
import {debounceTime} from 'rxjs/operators';
import {PhoneUtil} from '../../../util/phone.util';

@Component({
    selector: 'vex-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    icClose = icClose;

    form: UntypedFormGroup;
    phoneMask: string;

    constructor(@Inject(MAT_DIALOG_DATA) private _data: Contact,
                private _fb: UntypedFormBuilder,
                private _service: ContactService,
                private _dialogRef: MatDialogRef<DialogComponent>) {
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

    private initForm() {
        this.form = this._fb.group({
            id: [this._data?.id],
            name: [this._data?.name || '', Validators.required],
            email: [this._data?.email || '', [Validators.email]],
            ddi: [this._data?.ddi || '', Validators.required],
            number: [this._data?.number || '', Validators.required],
            note: [this._data?.note || ''],
        });

        this.changePhoneMask(this.form.get('ddi').value);

        this.form.get('ddi')
            .valueChanges
            .pipe(debounceTime(400))
            .subscribe(value => {
                this.changePhoneMask(value);
                this.form.get('number').setValue('');
            });
    }

    private changePhoneMask(ddi: string) {
        this.phoneMask = PhoneUtil.getPhoneMask(ddi);
    }

}
