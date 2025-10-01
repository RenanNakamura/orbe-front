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
            case 'BANNED':
                return 'bg-red-100 text-red-400';
            case 'CONNECTED':
                return 'bg-green-100 text-green-400';
            case 'DELETED':
                return 'bg-red-100 text-red-400';
            case 'DISCONNECTED':
                return 'bg-gray-100 text-gray-400';
            case 'FLAGGED':
                return 'bg-amber-100 text-amber-400';
            case 'MIGRATED':
                return 'bg-purple-100 text-purple-400';
            case 'PENDING':
                return 'bg-amber-100 text-amber-400';
            case 'RATE_LIMITED':
                return 'bg-orange-100 text-orange-400';
            case 'RESTRICTED':
                return 'bg-orange-100 text-orange-400';
            case 'UNKNOWN':
                return 'bg-gray-100 text-gray-400';
            case 'UNVERIFIED':
                return 'bg-amber-100 text-amber-400';
            default:
                return '';
        }
    }
}

@Pipe({
    name: 'backgroundStatusColorPipe',
})
export class BackgroundStatusColorPipe implements PipeTransform {
    transform(value: string | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case 'BANNED':
                return 'bg-red';
            case 'CONNECTED':
                return 'bg-green';
            case 'DELETED':
                return 'bg-red';
            case 'DISCONNECTED':
                return 'bg-gray';
            case 'FLAGGED':
                return 'bg-amber';
            case 'MIGRATED':
                return 'bg-purple';
            case 'PENDING':
                return 'bg-amber';
            case 'RATE_LIMITED':
                return 'bg-orange';
            case 'RESTRICTED':
                return 'bg-orange';
            case 'UNKNOWN':
                return 'bg-gray';
            case 'UNVERIFIED':
                return 'bg-amber';
            default:
                return '';
        }
    }
}

@NgModule({
    declarations: [
        LabelStatusColorPipe,
        BackgroundStatusColorPipe,
    ],
    exports: [
        LabelStatusColorPipe,
        BackgroundStatusColorPipe,
    ],
})
export class StatusColorPipeModule {
}
