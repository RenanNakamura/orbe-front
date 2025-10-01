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
