import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlowExecution, Log, LogMessage} from '../../../model/flow/Flow';
import {FlowExecutionService} from '../../../service/flow/flow-execution.service';
import {PhoneUtil} from '../../../util/phone.util';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../service/sk/language.service';

@Component({
  selector: 'vex-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit {

  flowExecution: FlowExecution;
  isIdCopied: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: FlowExecution,
    private _fb: UntypedFormBuilder,
    private _service: FlowExecutionService,
    private _dialogRef: MatDialogRef<HistoryDialogComponent>,
    private _translate: TranslateService,
    private _languageService: LanguageService
  ) {
  }

  ngOnInit(): void {
    this._service.get(this._data?.id).subscribe(async (data) => {
      this.flowExecution = Object.assign(data, {
        phone: PhoneUtil.getPhoneWithMask(data.phone),
      });
      await this.preProcessLogs(this.flowExecution?.logs);
    });
  }

  async preProcessLogs(logs: Log[]) {
    for (const log of logs || []) {
      for (const logMessage of log.messages) {
        if (log.entry === 'COMMAND') {
          const translated = await this._translate
            .get(logMessage.message.body)
            .toPromise();
          logMessage.message.body = translated || logMessage.message.body;
        }
      }
    }
  }

  async onCopy(value: string) {
    await navigator.clipboard.writeText(value);
    this.isIdCopied = true;
    setTimeout(() => {
      this.isIdCopied = false;
    }, 1000);
  }

  onGetCopiedText(): string {
    return this._translate.instant('copied');
  }

  onBuildLogMessageError(logMessage: LogMessage): { code: string; message: string } {
    return this._languageService.getErrorMessage(logMessage?.error);
  }

}
