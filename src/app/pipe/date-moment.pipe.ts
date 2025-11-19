import {NgModule, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment-timezone';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'dateMoment',
})
export class DateMomentPipe implements PipeTransform {

  transform(value: any | null): any {

    if (!value) return '';

    const now = moment().tz(moment.tz.guess());
    const date = moment(value).tz(moment.tz.guess());

    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    } else {
      return date.format('DD/MM/YYYY HH:mm');
    }
  }
}

@Pipe({
  name: 'dateOnlyHour',
})
export class DateOnlyHourPipe implements PipeTransform {

  constructor(private _translate: TranslateService) {
  }

  transform(value: any | null): any {
    if (!value) return '';

    const now = moment().tz(moment.tz.guess());
    const date = moment(value).tz(moment.tz.guess());

    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    }

    if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return `${this._translate.instant('yesterday')} - ${date.format('HH:mm')}`;
    }

    return date.format('DD/MM/YYYY - HH:mm');
  }
}

@NgModule({
  declarations: [DateMomentPipe, DateOnlyHourPipe],
  exports: [DateMomentPipe, DateOnlyHourPipe],
})
export class DateMomentPipeModule {
}
