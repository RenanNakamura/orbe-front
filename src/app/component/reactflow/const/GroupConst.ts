import {useTranslation} from 'react-i18next';
import {Group} from '../component/groupList/GroupList';

export class GroupConst {

    public static getContactFieldGroup(): Group[] {
        const {t} = useTranslation();
        return [
            {
                title: t('contactFields'),
                type: 'CONTACT',
                items: [
                    {
                        label: t('name'),
                        value: 'name',
                    },
                    {
                        label: t('email'),
                        value: 'email',
                    },
                    {
                        label: t('address'),
                        value: 'address',
                    },
                ]
            }
        ];
    }

    public static getOperatorsGroup(): Group[] {
        const {t} = useTranslation();
        return [
            {
                title: t('conditionMatchLabel'),
                type: 'OPERATOR',
                items: [
                    {
                        label: t('operator.any'),
                        value: 'ANY',
                    },
                    {
                        label: t('operator.all'),
                        value: 'ALL',
                    },
                ]
            }
        ];
    }

    public static getTimeIntervalGroup(): Group[] {
        const {t} = useTranslation();
        return [
            {
                title: t('timeInterval'),
                type: 'TIME',
                items: [
                    {
                        label: t('seconds'),
                        value: 'SECONDS',
                    },
                    {
                        label: t('minutes'),
                        value: 'MINUTES',
                    },
                    {
                        label: t('hours'),
                        value: 'HOURS',
                    },
                    {
                        label: t('days'),
                        value: 'DAYS',
                    },
                ]
            }
        ];
    }

}
