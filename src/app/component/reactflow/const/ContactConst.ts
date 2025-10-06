import {useTranslation} from 'react-i18next';

export class ContactConst {

    public static getType() {
        const {t} = useTranslation();
        return [
            {value: 'MOBILE', label: t('mobile')},
            {value: 'LANDLINE', label: t('landline')},
        ];
    }

}
