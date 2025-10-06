import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import pt from './locale/pt';
import us from './locale/us';

const resources = {
    pt: {
        translation: pt,
    },
    us: {
        translation: us,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt',
        fallbackLng: 'pt',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
