import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {debounceTime} from 'rxjs/operators';
import {PhoneUtil} from '../../../util/phone.util';
import {UserService} from '../../../service/user/user.service';
import {User} from '../../../model/User';
import {Language} from '../../../model/sk/Language';

@Component({
    selector: 'vex-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    icClose = icClose;

    form: UntypedFormGroup;
    phoneMask: string;
    languages = Language;

    constructor(@Inject(MAT_DIALOG_DATA) private _data: User,
                private _fb: UntypedFormBuilder,
                private _service: UserService,
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

    isNew(): boolean {
        return !this.form.get('id').value;
    }

    private initForm() {
        this.form = this._fb.group({
            id: [this._data?.id],
            name: [this._data?.name || '', Validators.required],
            email: [this._data?.email || '', [Validators.required, Validators.email]],
            ddi: [this._data?.ddi || '', Validators.required],
            number: [this._data?.number || '', Validators.required],
            language: [this._data?.language || '', Validators.required],
        });

        if (this.isNew()) {
            this.form.addControl('password', new UntypedFormControl('', Validators.required));
        }

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
