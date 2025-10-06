import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Select from 'react-select';
import {useTranslation} from 'react-i18next';
import {ConditionConst} from '../../../const/ConditionConst';
import {Field, Type} from '../../../../../model/flow/Condition';
import {MdClose} from 'react-icons/md';

export interface Props {
    header?: string;
    btnSubmitLabel?: string;
    btnCancelLabel?: string;
    condition?: any;
    tags: { label: string, value: string }[];
    onSubmit?: (action) => void;
    onCancel?: () => void;
    onCloseModal?: () => void;
}

const ModalCondition = (props: Props) => {
    const {condition, tags} = props;
    const {t} = useTranslation();

    const [conditions, setConditions] = useState(ConditionConst.getAllConditions());
    const [fields] = useState(ConditionConst.getFields());

    const translatedFields = useMemo(() => {
        return fields.map(c => ({...c, label: t(c.label)}));
    }, [fields, t]);

    const translatedConditions = useMemo(() => {
        return conditions.map(c => ({...c, label: t(c.label)}));
    }, [conditions, t]);

    const getDefaultField = () => {
        if (condition?.field) {
            return translatedFields.find(f => f.value === condition.field);
        }

        return translatedFields[0];
    };

    const getDefaultType = () => {
        if (condition?.type) {
            return translatedConditions.find(c => c.value === condition.type);
        }

        return translatedConditions[0];
    };

    const getDefaultValues = () => {
        if (condition?.field === Field.tag) {
            return tags.filter(g => condition.values.includes(g.value));
        }

        return condition?.values || [];
    };

    const [field, setField] = useState(getDefaultField());
    const [type, setType] = useState(getDefaultType());
    const [values, setValues] = useState(getDefaultValues());

    useEffect(() => {
        switch (field?.value) {
            case Field.phone:
                setConditions(ConditionConst.getConditionsForPhone());
                break;
            case Field.tag:
                setConditions(ConditionConst.getConditionsForTag());
                break;
            default:
                setConditions(ConditionConst.getAllConditions());
        }
    }, [field]);

    useEffect(() => {
        const matchedType = conditions.find(c => c.value === type.value);

        if (!matchedType) {
            setType(translatedConditions[0]);
        }
    }, [conditions]);

    const onChangeField = useCallback((option) => {
        setField(option);
        setValues([]);
    }, [field, conditions]);

    const onChangeCondition = useCallback((option) => {
        setType(option);

        if (option?.value === Type.EMPTY || option?.value === Type.NOT_EMPTY) {
            setValues([]);
        }
    }, []);

    const onChangeValues = useCallback((options) => {
        setValues(options);
    }, [values]);

    const onSubmit = useCallback(() => {
        if (field.value === Field.tag) {
            const valuesMapped = values.map(v => v.value);

            const result = {
                field: field?.value,
                type: type?.value,
                values: valuesMapped
            };

            props.onSubmit(result);

            return;
        }

        const submit = {
            field: field?.value,
            type: type?.value,
            values,
        };

        props.onSubmit(submit);
    }, [field, type, values, props]);

    const isTag = useCallback(() => {
        return field?.value === Field.tag;
    }, [field]);

    const isEmptys = useCallback(() => {
        return type?.value === Type.EMPTY || type?.value === Type.NOT_EMPTY;
    }, [type]);

    return (
        <div className='xyflow-modal-container'>
            <div className='xyflow-modal'>
                <div className='xyflow-modal-header mt-2 mb-4'>
                    <h2 className={'ml-2'}>{props.header ? props.header : t('conditionNode.modal.title')}</h2>
                    <MdClose className={'cursor-pointer'} onClick={props.onCloseModal} size={18}/>
                </div>
                <div className='xyflow-modal-divider'></div>
                <div className='xyflow-modal-content'>
                    <div className='add-condition-modal-content'>
                        <div className={'mt-4'}>
                            <label htmlFor='field'>{t('conditionNode.modal.selectField')}</label>
                            <Select
                                id='field'
                                value={field}
                                onChange={onChangeField}
                                options={translatedFields}
                                placeholder={t('select')}
                            />
                        </div>
                        <div className={'mt-4'}>
                            <label htmlFor='condition'>{t('conditionNode.modal.selectCondition')}</label>
                            <Select
                                id='condition'
                                value={type}
                                onChange={onChangeCondition}
                                options={translatedConditions}
                                placeholder={t('select')}
                            />
                        </div>
                        {
                            (!isTag() && !isEmptys()) && (
                                <div className={'mt-4 w-full'}>
                                    <input
                                        className={'f-input w-full'}
                                        type='text'
                                        value={values[0] || ''}
                                        onChange={(e) => onChangeValues([e.target.value])}
                                        placeholder={t('conditionValuePrompt')}
                                    />
                                </div>
                            )
                        }
                        {
                            (isTag() && !isEmptys()) && (
                                <div className={'mt-4'}>
                                    <label htmlFor='type'>{t('tags')}</label>
                                    <Select
                                        id='type'
                                        value={values}
                                        onChange={onChangeValues}
                                        options={tags}
                                        placeholder={t('selectTag')}
                                        isMulti={true}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='xyflow-modal-footer'>
                    <button
                        className='f-btn f-btn-cancel'
                        type='button'
                        onClick={props.onCancel}>
                        {props.btnCancelLabel ? props.btnCancelLabel : t('cancel')}
                    </button>
                    <button
                        className='f-btn f-btn-primary text-primary-600'
                        type='button'
                        onClick={onSubmit}>
                        {props.btnSubmitLabel ? props.btnSubmitLabel : t('add')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCondition;
