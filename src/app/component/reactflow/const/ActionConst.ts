import {useTranslation} from 'react-i18next';
import {Type} from '../../../model/flow/Action';

export class ActionConst {

    public static getActions() {
        const {t} = useTranslation();

        return [
            {value: Type.ADD_TAG, label: t('actions.addTag')},
            {value: Type.REMOVE_TAG, label: t('actions.removeTag')},
        ];
    }

}
