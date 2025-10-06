import React from 'react';
import Select from 'react-select';
import {ComparisonType, TriggerType} from '../../../../../model/flow/Trigger';
import {useFormik} from 'formik';
import {TriggerConst} from '../../../const/TriggerConst';
import {useTranslation} from 'react-i18next';
import {StartNodeValidation} from '../../../validation/StartNodeValidation';
import {MdAdd, MdClose, MdDelete} from 'react-icons/md';

export interface Props {
    header?: string;
    btnSubmitLabel?: string;
    btnCancelLabel?: string;
    trigger?: any;
    onSubmit?: (trigger) => void;
    onCancel?: () => void;
    onCloseModal?: () => void;
}

const ModalTrigger = (props: Props) => {
    const {t} = useTranslation();

    const modalSchemaValidation = StartNodeValidation.getModalValidation();
    const types = TriggerConst.getTriggersTypeLabels();
    const comparisonTypes = TriggerConst.getTriggersComparisonLabels();

    const typeDefault = types.filter(ty => ty.value === TriggerType.WHATSAPP_KEYWORD)[0];
    const camparisonDefault = comparisonTypes.filter(c => c.value === ComparisonType.START_WITH)[0];
    const initialTrigger = {
        type: types?.find((ty) => ty.value === props?.trigger?.type) || typeDefault,
        comparisonType: comparisonTypes?.find((c) => c.value === props?.trigger?.comparisonType) || camparisonDefault,
        words: props?.trigger?.words || ['']
    };

    const onWordChange = (index, value) => {
        const newWords = [...formik.values.words];
        newWords[index] = value;
        formik.setFieldValue('words', newWords);
    };

    const addWord = () => {
        formik.setFieldValue('words', [...formik.values.words, '']);
    };

    const removeWord = (index) => {
        const newWords = [...formik.values.words];
        newWords.splice(index, 1);
        formik.setFieldValue('words', newWords);
    };

    const buildTrigger = (values) => {
        if (values.type?.value === TriggerType.WHATSAPP_STANDARD_FLOW) {
            return {
                type: values.type?.value,
            };
        }

        return {
            type: values.type?.value,
            comparisonType: values.comparisonType?.value,
            words: values.words
        };
    };

    const onSubmit = (values) => {
        const trigger = buildTrigger(values);
        props.onSubmit(trigger);
    };

    const isWhatsAppKeyword = () => {
        return formik.values.type && formik.values.type.value === TriggerType.WHATSAPP_KEYWORD;
    };

    const formik = useFormik({
        initialValues: initialTrigger,
        validationSchema: modalSchemaValidation,
        onSubmit: (values) => onSubmit(values),
    });

    return (
        <div className='xyflow-modal-container'>
            <form className='xyflow-modal' onSubmit={formik.handleSubmit}>
                <div className='xyflow-modal-header mt-2 mb-4'>
                    <h2 className={'ml-2'}>{props.header ? props.header : t('startNode.modal.title')}</h2>
                    <MdClose className={'cursor-pointer'} onClick={props.onCloseModal} size={18}/>
                </div>
                <div className='xyflow-modal-divider'></div>
                <div className='xyflow-modal-content'>
                    <div className='add-trigger-modal-content'>
                        <div className={'mt-4'}>
                            <label htmlFor='type'>{t('startNode.modal.selectTrigger')}</label>
                            <Select
                                id='type'
                                name='type'
                                value={formik.values.type}
                                onChange={(option) => {
                                    formik.setFieldValue('type', option);
                                }}
                                options={types}
                                placeholder={t('select')}
                            />
                        </div>
                        {isWhatsAppKeyword() && (
                            <div>
                                <div className={'mt-4'}>
                                    <label htmlFor='comparisonType'>{t('startNode.modal.comparisonType')}</label>
                                    <Select
                                        id={'comparisonType'}
                                        value={formik.values.comparisonType}
                                        onChange={(option) => {
                                            formik.setFieldValue('comparisonType', option);
                                        }}
                                        options={comparisonTypes}
                                        placeholder={'Selecione...'}
                                    />
                                </div>
                                <div className={'mt-2'}>
                                    <label htmlFor='words'>{t('keyword')}</label>
                                    {
                                        formik.values.words.map((word, index) => (
                                            <div key={index} className={`${index === 0 ? '' : 'mt-2'}`}>
                                                <div className={'flex'}>
                                                    <div className={'w-full'}>
                                                        <input
                                                            className={'f-input w-full'}
                                                            type='text'
                                                            value={word}
                                                            onChange={(e) => onWordChange(index, e.target.value)}
                                                            placeholder={t('provideTheKeyword')}
                                                        />
                                                    </div>

                                                    <div className={'flex self-center ml-2'}>
                                                        {
                                                            index === formik.values.words.length - 1 && formik.values.words.length <= 4
                                                                ?
                                                                (
                                                                    <MdAdd className={'text-primary-600 cursor-pointer'}
                                                                           onClick={addWord}
                                                                           size={20}
                                                                    />
                                                                )
                                                                :
                                                                formik.values.words.length > 1 && (
                                                                    <MdDelete className={'text-red-600 cursor-pointer'}
                                                                              onClick={() => removeWord(index)}
                                                                              size={20}
                                                                    />
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    formik.touched.words &&
                                                    formik.touched.words[index] &&
                                                    formik.errors.words &&
                                                    formik.errors.words[index] && (
                                                        <div className='text-red-600'>{formik.errors.words[index]}</div>
                                                    )
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
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
                        type='submit'>
                        {props.btnSubmitLabel ? props.btnSubmitLabel : t('add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalTrigger;
