import {NgModule, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment-timezone';

@Pipe({
    name: 'dateMoment',
})
export class DateMomentPipe implements PipeTransform {

    transform(value: any | null): any {
        if (!value) {
            return '';
        }

        return moment(value).format('DD/MM/YYYY HH:mm:ss');
    }
}

@NgModule({
    declarations: [DateMomentPipe],
    exports: [DateMomentPipe],
})
export class DateMomentPipeModule {
}
