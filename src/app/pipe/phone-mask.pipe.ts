import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {PhoneUtil} from "../util/phone.util";

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(phone: string, ddi?: string): string {
    if (!phone) return '';

    try {
      // Caso o DDI não tenha sido passado, tenta extrair do número
      const countryCode = ddi || PhoneUtil.extractOnlyCountryCode(phone);
      if (!countryCode) return phone;

      const masked = PhoneUtil.getPhoneWithMask(`${countryCode}${this.removeCountryCode(phone, countryCode)}`);
      return masked || phone;
    } catch {
      return phone;
    }
  }

  private removeCountryCode(phone: string, countryCode: string): string {
    const code = countryCode.startsWith('+') ? countryCode.substring(1) : countryCode;
    return phone.startsWith(code) ? phone.substring(code.length) : phone;
  }
}

@NgModule({
  declarations: [PhoneMaskPipe],
  exports: [PhoneMaskPipe],
})
export class PhoneMaskPipeModule {
}
