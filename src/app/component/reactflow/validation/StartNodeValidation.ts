import {useTranslation} from 'react-i18next';
import * as yup from 'yup';
import {TriggerType} from '../../../model/flow/Trigger';

export class StartNodeValidation {

    public static getModalValidation() {
        const {t} = useTranslation();

        return yup.object({
            type: yup
                .object()
                .required(t('startNode.validation.type.required')),
            comparisonType: yup
                .object()
                .when('type', {
                    is: (type) => type.value === TriggerType.WHATSAPP_KEYWORD,
                    then: (type) => yup.object().required(t('startNode.validation.comparisonType.required')),
                }),
            words: yup
                .array()
                .when('type', {
                    is: (type) => type.value === TriggerType.WHATSAPP_KEYWORD,
                    then: (type) => yup.array().of(
                        yup.string()
                            .required(t('startNode.validation.keyword.required'))
                            .test(
                                'is-not-empty',
                                t('startNode.validation.keyword.notEmpty'),
                                value => value.trim() !== ''
                            )
                    ).min(1, t('startNode.validation.keyword.min')),
                }),
        });
    }

}
