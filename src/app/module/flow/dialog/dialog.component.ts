import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreateFlow, Flow, UpdateFlow} from "../../../model/flow/Flow";
import {FlowService} from "../../../service/flow/flow.service";
import {Channel, ChannelParams} from "../../../model/Channel";
import {ChannelService} from "../../../service/channel/channel.service";
import {Router} from "@angular/router";

@Component({
  selector: 'vex-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  form: UntypedFormGroup;
  channels: Channel[];

  constructor(@Inject(MAT_DIALOG_DATA) private _data: Flow,
              private _fb: UntypedFormBuilder,
              private _service: FlowService,
              private _channelService: ChannelService,
              private _router: Router,
              private _dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
    this._channelService.list(this.getDefaultParams())
      .subscribe((data) => {
        this.channels = data.content;
      })
    this.initForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      const id = this.form.get('id').value;
      const name = this.form.get('name').value;
      const channel = this.channels.find(c => c.id === this.form.get('channelId').value);

      if (!id) {
        const input: CreateFlow = {
          name: name,
          channelId: channel.id,
          phoneNumberId: channel.phoneNumberId
        }

        await this._service.create(input);
      } else {
        const input: UpdateFlow = {
          name: name,
          channelId: channel.id,
          phoneNumberId: channel.phoneNumberId
        }

        await this._service.update(id, input);
      }

      this._dialogRef.close();
    }
  }

  private initForm() {
    this.form = this._fb.group({
      id: [this._data?.id],
      name: [this._data?.name || '', Validators.required],
      channelId: [this._data?.channel?.channelId || '', [Validators.required]],
    });
  }

  private getDefaultParams(): ChannelParams {
    return {
      sort: 'createdDate,desc',
    };
  }
}
