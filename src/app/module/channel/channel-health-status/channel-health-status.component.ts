import {Component, Input, OnInit} from '@angular/core';
import {Entities, HealthStatus} from '../../../model/PhoneNumberInfo';

@Component({
    selector: 'app-channel-health-status',
    templateUrl: './channel-health-status.component.html',
    styleUrls: ['./channel-health-status.component.scss']
})
export class ChannelHealthStatusComponent implements OnInit {

    @Input() healthStatus: HealthStatus;
    protected messageStatus: { label: string; classes: string };
    protected entities: Entities[];

    ngOnInit(): void {
        this.messageStatus = this.getStatusClass(this.healthStatus?.can_send_message);
        this.entities = this.healthStatus?.entities;
    }

    getStatusClass(status: string): { label: string; classes: string } {
        const map: Record<string, { label: string; classes: string }> = {
            AVAILABLE: { label: 'channel.quality.AVAILABLE', classes: 'bg-green-100 text-green-500' },
            LIMITED: { label: 'channel.quality.LIMITED', classes: 'bg-amber-100 text-amber-500' },
            BLOCKED: { label: 'channel.quality.BLOCKED', classes: 'bg-red-100 text-red-500' },
            UNKNOWN: { label: 'channel.quality.UNKNOWN', classes: 'bg-gray-100 text-gray-500' }
        };

        return map[status] ?? map?.['UNKNOWN'];
    }

    getEntityTitle(entityType: string): string {
        switch (entityType) {
            case 'PHONE_NUMBER': return 'channel.entity.phone-number';
            case 'WABA': return 'channel.entity.waba';
            case 'BUSINESS': return 'channel.entity.business';
            case 'APP': return 'channel.entity.app';
            default: return entityType;
        }
    }
}
