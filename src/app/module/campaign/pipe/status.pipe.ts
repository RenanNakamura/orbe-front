import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Campaign, Status} from '../../../model/Campaign';
import moment from 'moment-timezone';

@Pipe({
    name: 'status',
})
export class StatusPipe implements PipeTransform {

    constructor(private translate: TranslateService) {
    }

    transform(campaign: Campaign | null): any {
        if (!campaign) {
            return '';
        }

        let text: string;
        let params = {};

        switch (campaign.status) {
            case Status.FINISHED:
                const finalizedDate = campaign?.finalizedDate;
                if (finalizedDate) {
                    text = 'campaign.finished_at';
                    params = {
                        date: moment(finalizedDate).format('DD/MM/YYYY HH:mm:ss'),
                    };
                } else {
                    text = campaign.status;
                }
                break;

            case Status.SCHEDULED:
                const scheduling = campaign?.scheduling;
                if (scheduling) {
                    text = 'campaign.scheduled_at';
                    params = {
                        date: moment(scheduling).format('DD/MM/YYYY HH:mm:ss'),
                    };
                } else {
                    text = campaign.status;
                }
                break;

            default:
                text = campaign.status;
        }

        return this.translate.instant(text, params);
    }
}

@NgModule({
    declarations: [StatusPipe],
    exports: [StatusPipe],
})
export class StatusPipeModule {
}
