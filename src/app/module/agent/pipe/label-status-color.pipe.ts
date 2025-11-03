import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'labelStatusColor',
})
export class LabelStatusColorPipe implements PipeTransform {
    transform(value: string | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-500';
            case 'INACTIVE':
                return 'bg-red-100 text-red-500';
            case 'PENDING_INVITE':
                return 'bg-cyan-100 text-cyan-500';
            case 'AGENT':
                return 'bg-gray-100 text-gray-500';
            case 'ADMIN':
                return 'bg-primary-100 text-primary-500';
            default:
                return '';
        }
    }
}

@NgModule({
    declarations: [
        LabelStatusColorPipe
    ],
    exports: [
        LabelStatusColorPipe
    ],
})
export class StatusColorPipeModule {
}
