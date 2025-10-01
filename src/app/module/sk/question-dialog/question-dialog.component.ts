import {Component, Inject, OnInit} from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface QuestionConfig {
    description: string;
}

@Component({
    selector: 'vex-question-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {

    icClose = icClose;

    constructor(@Inject(MAT_DIALOG_DATA) public _data: QuestionConfig,
                private _dialogRef: MatDialogRef<QuestionDialogComponent>) {
    }

    ngOnInit(): void {
    }

    onClose() {
        this._dialogRef.close('yes');
    }
}
