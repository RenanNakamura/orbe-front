import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {Status} from '../../../model/Campaign';

@Pipe({
    name: 'labelCampaignContactStatusColorPipe',
})
export class LabelCampaignContactStatusColorPipe implements PipeTransform {

    transform(value: string | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case 'SENT':
                return 'sent';
            case 'WAITING':
                return 'waiting';
            case 'SENDING':
                return 'sending';
            case 'DELIVERED':
                return 'delivered';
            case 'READ':
                return 'read';
            case 'SHOOTING_ERROR':
                return 'error';
            case 'WHATSAPP_NOT_EXIST':
                return 'error';
            case 'INVALID_NUMBER':
                return 'error';
            case 'FAILED':
                return 'failed';
            default:
                return '';
        }
    }
}

@Pipe({
    name: 'labelStatusColor',
})
export class LabelStatusColorPipe implements PipeTransform {
    transform(value: Status | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case Status.PLANNING:
                return 'bg-amber-100 text-amber-500';
            case Status.RUNNING:
                return 'bg-cyan-100 text-cyan-500';
            case Status.PAUSED:
                return 'bg-gray-100 text-gray-500';
            case Status.FINISHED:
                return 'bg-green-100 text-green-500';
            case Status.SCHEDULED:
                return 'bg-purple-100 text-purple-500';
            default:
                return '';
        }
    }
}

@NgModule({
    declarations: [
        LabelStatusColorPipe,
        LabelCampaignContactStatusColorPipe
    ],
    exports: [
        LabelStatusColorPipe,
        LabelCampaignContactStatusColorPipe
    ],
})
export class StatusColorPipeModule {
}
