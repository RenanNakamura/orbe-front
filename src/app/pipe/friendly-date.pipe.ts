import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import moment from "moment-timezone";

@Pipe({
  name: 'friendlyDate'
})
export class FriendlyDatePipe implements PipeTransform {

  constructor(private _translate: TranslateService) {}

  transform(value: string | Date): string {
    if (!value) return '';

    const now = moment().tz(moment.tz.guess());
    const date = moment(value).tz(moment.tz.guess());

    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    } else if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return this._translate.instant('yesterday');
    } else {
      return date.format('DD/MM/YYYY');
    }
  }
}

@NgModule({
  declarations: [FriendlyDatePipe],
  exports: [FriendlyDatePipe],
})
export class FriendlyDatePipeModule {}
