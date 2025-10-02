import {Component, Inject, OnInit} from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

export interface InputDialogConfig {
    header: string;
    inputLabel: string;
    value: string;
    required: boolean;
    messageRequired: string;
}

@Component({
    selector: 'vex-input-dialog',
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit {

    icClose = icClose;

    form: UntypedFormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public _data: InputDialogConfig,
                private _dialogRef: MatDialogRef<InputDialogComponent>,
                private _fb: UntypedFormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    onSubmit() {
        if (this.form.valid) {
            this._dialogRef.close(this.form.get('value').value);
        }
    }

    private initForm() {
        const valueArray = this._data.required ? [this._data?.value || '', Validators.required] : [this._data?.value || ''];
        this.form = this._fb.group({
            value: valueArray,
        });
    }
}
