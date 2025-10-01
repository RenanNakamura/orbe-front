import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {Status} from '../../../model/Template';

@Pipe({
    name: 'labelStatusColor',
})
export class LabelStatusColorPipe implements PipeTransform {
    transform(value: Status | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case Status.PENDING:
                return 'bg-cyan-100 text-cyan-400';
            case Status.REJECTED:
                return 'bg-red-100 text-red-400';
            case Status.PAUSED:
                return 'bg-gray-100 text-gray-400';
            case Status.APPROVED:
                return 'bg-green-100 text-green-400';
            default:
                return '';
        }
    }
}

@NgModule({
    declarations: [LabelStatusColorPipe],
    exports: [LabelStatusColorPipe],
})
export class StatusColorPipeModule {
}
