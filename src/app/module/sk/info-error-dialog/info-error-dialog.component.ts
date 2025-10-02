import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface InfoErrorConfig {
  code: string;
  details: string;
}

@Component({
  selector: 'vex-question-dialog',
  templateUrl: './info-error-dialog.component.html',
  styleUrls: ['./info-error-dialog.component.scss']
})
export class InfoErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public _data: InfoErrorConfig,
              private _dialogRef: MatDialogRef<InfoErrorDialogComponent>) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this._dialogRef.close();
  }
}
