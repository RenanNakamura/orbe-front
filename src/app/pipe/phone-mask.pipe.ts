import {NgModule, Pipe, PipeTransform} from '@angular/core';
import parsePhoneNumberFromString from 'libphonenumber-js';

@Pipe({
    name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {
    transform(value: string | null): string {
        if (!value) { return ''; }

        const cleaned = value.replace(/\D/g, '');

        // Se já começa com '+', usa direto
        const international = value.startsWith('+')
            ? value
            : '+' + cleaned;

        const phone = parsePhoneNumberFromString(international);

        return phone?.formatInternational() || this.formatGeneric(cleaned);
    }

    private formatGeneric(value: string): string {
        // Ex: quebra em blocos de até 4 dígitos
        return value.replace(/(.{1,4})/g, '$1 ').trim();
    }
}

@NgModule({
    declarations: [PhoneMaskPipe],
    exports: [PhoneMaskPipe],
})
export class PhoneMaskPipeModule { }
