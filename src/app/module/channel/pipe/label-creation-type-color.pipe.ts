import {NgModule, Pipe, PipeTransform} from '@angular/core';
import { ChannelCreationType } from 'src/app/model/Channel';

@Pipe({
    name: 'labelCreationTypeColor',
})
export class LabelCreationTypeColorPipe implements PipeTransform {
    transform(value: ChannelCreationType | null): any {
        if (!value) {
            return '';
        }

        switch (value) {
            case ChannelCreationType.FACEBOOK:
                return 'bg-cyan-100 text-cyan-400';
            case ChannelCreationType.MANUAL:
                return 'bg-gray-100 text-gray-400';
            default:
                return '';
        }
    }
}

@NgModule({
    declarations: [LabelCreationTypeColorPipe],
    exports: [LabelCreationTypeColorPipe],
})
export class CreationTypeColorPipeModule {
}
