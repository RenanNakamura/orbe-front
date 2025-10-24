import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Language} from '../../../model/sk/Language';
import {AgentService} from "../../../service/agent/agent.service";
import {ListAgentResponse} from "../../../model/chat/agent";

@Component({
  selector: 'vex-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  form: UntypedFormGroup;
  languages = Language;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: ListAgentResponse,
              private _fb: UntypedFormBuilder,
              private _service: AgentService,
              private _dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit() {
    if (this.form.valid) {

      if (!this.form.get('id').value) {
        this._service
          .create(this.form.value)
          .subscribe(() => this._dialogRef.close());
      } else {
        this._service
          .update(this.form.get('id').value, this.form.value)
          .subscribe(() => this._dialogRef.close());
      }
    }
  }

  isNew(): boolean {
    return !this.form.get('id').value;
  }

  private initForm() {
    const isEdit = !!this._data?.id;

    this.form = this._fb.group({
      id: [this._data?.id],
      name: [this._data?.name || '', Validators.required],
      email: [
        { value: this._data?.email || '', disabled: isEdit },
        [Validators.required, Validators.email]
      ],
      role: [this._data?.role || 'AGENT', [Validators.required]],
      status: [this._data?.status || 'ACTIVE', [Validators.required]],
      language: [this._data?.language || Language.PORTUGUESE_BRAZIL, Validators.required],
    });
  }

}
