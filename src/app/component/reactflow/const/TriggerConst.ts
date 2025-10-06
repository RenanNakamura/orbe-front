import {useTranslation} from 'react-i18next';

export class TriggerConst {

    public static getTriggerTypeLabels() {
        const {t} = useTranslation();
        return {
            WHATSAPP_KEYWORD: t('keyword'),
            WHATSAPP_STANDARD_FLOW: t('anyWord'),
        };
    }

    public static getTriggerComparisonLabels() {
        const {t} = useTranslation();
        return {
            START_WITH: t('startWith'),
            CONTAINS: t('contains'),
            EQUALS: t('equalsTo'),
        };
    }

    public static getTriggersTypeLabels() {
        const {t} = useTranslation();
        return [
            {value: 'WHATSAPP_KEYWORD', label: t('keyword')},
            {value: 'WHATSAPP_STANDARD_FLOW', label: t('anyWord')},
        ];
    }

    public static getTriggersComparisonLabels() {
        const {t} = useTranslation();
        return [
            {value: 'START_WITH', label: t('startWith')},
            {value: 'CONTAINS', label: t('contains')},
            {value: 'EQUALS', label: t('equalsTo')},
        ];
    }

}
