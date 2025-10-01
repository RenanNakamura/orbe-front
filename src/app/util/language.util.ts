import {Language} from '../model/sk/Language';
import languages from '../../assets/json/language.json';

export class LanguageUtil {

    private static languagesOptions: { language: string; code: string }[] = languages;

    static toLanguage(lang: string): Language {
        switch (lang) {
            case'pt':
                return Language.PORTUGUESE_BRAZIL;
            case'us':
                return Language.ENGLISH_US;
        }
    }

    static toLang(language: Language): string {
        switch (language) {
            case Language.PORTUGUESE_BRAZIL:
                return 'pt';
            case Language.ENGLISH_US:
                return 'us';
        }
    }

    static getLanguageName(code: string): string {
        const lang = LanguageUtil.languagesOptions.find(language => language.code === code);
        return lang ? lang.language : code;
    }
}
