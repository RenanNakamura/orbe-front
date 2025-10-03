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
            case 'PENDING':
                return 'bg-amber-100 text-amber-500';
            case 'INTERRUPTED':
                return 'bg-orange-100 text-orange-500';
            case 'EXECUTION':
                return 'bg-cyan-100 text-cyan-500';
            case 'FINISHED':
                return 'bg-green-100 text-green-500';
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
