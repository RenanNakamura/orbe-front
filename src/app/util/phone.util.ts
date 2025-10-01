import {PhoneNumberFormat, PhoneNumberType, PhoneNumberUtil} from 'google-libphonenumber';
import parsePhoneNumber from 'libphonenumber-js';

export class PhoneUtil {

    public static getPhoneMask(ddi: string): string {
        const country = PhoneUtil.getCountry(ddi);
        return PhoneUtil.isValidCountry(country) ? PhoneUtil.getMask(country) : '';
    }

    public static getCountry(ddi: string) {
        try {
            const phoneUtil = PhoneNumberUtil.getInstance();
            return phoneUtil.getRegionCodeForCountryCode(ddi);
        } catch (e) {
            return;
        }
    }

    public static isValidCountry(country: string): boolean {
        return country && country !== 'ZZ';
    }

    public static getPhoneWithMask(phone: string): string {
        const phoneNumber = parsePhoneNumber(`+${phone}`);
        return phoneNumber.formatNational();
    }

    private static getMask(ddi: string): string {
        try {
            const phoneUtil = PhoneNumberUtil.getInstance();
            const exampleNumber = phoneUtil.getExampleNumberForType(ddi, PhoneNumberType.MOBILE);
            const number = phoneUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL);
            return number?.replace(/\d/g, '0');
        } catch (e) {
            return;
        }
    }

    public static extractOnlyCountryCode(phoneNumber: string): string {
        const phoneUtil = PhoneNumberUtil.getInstance();

        try {
            const phoneNumberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            const parsedNumber = phoneUtil.parse(phoneNumberWithPlus, 'ZZ');
            const countryCode = parsedNumber.getCountryCode();
            return countryCode.toString();
        } catch (e) {
            return '';
        }
    }
}
