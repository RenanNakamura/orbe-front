import React, {useCallback, useEffect, useState} from 'react';
import Select from 'react-select';
import {ActionConst} from '../../../const/ActionConst';
import {useTranslation} from 'react-i18next';
import {MdClose} from 'react-icons/md';

export interface Props {
    header?: string;
    btnSubmitLabel?: string;
    btnCancelLabel?: string;
    action?: any;
    tags: { label: string, value: string }[];
    onSubmit?: (action) => void;
    onCancel?: () => void;
    onCloseModal?: () => void;
}

const ModalAction = (props: Props) => {
    const {t} = useTranslation();
    const types = ActionConst.getActions();

    const [type, setType] = useState(types[0]);
    const [tags] = useState(props.tags);
    const [selectedGroups, setSelectedGroups] = useState([]);

    useEffect(() => {
        if (props.action) {
            const action = props.action;
            setType(types.find((c) => c.value === action.type));
            setSelectedGroups(tags.filter(g => !!action?.values.find(value => value === g.value)));
        }
    }, [props.action]);

    const onTypeChange = useCallback((option) => {
        setType(option);
    }, []);

    const onGroupChange = useCallback((options) => {
        setSelectedGroups(options);
    }, []);

    const onSubmit = useCallback(() => {
        const action = {
            type: type.value,
            values: selectedGroups.map(g => g.value),
        };

        props.onSubmit(action);
    }, [type, selectedGroups, props]);

    return (
        <div className='xyflow-modal-container'>
            <div className='xyflow-modal'>
                <div className='xyflow-modal-header mt-2 mb-4'>
                    <h2 className={'ml-2'}>{props.header ? props.header : t('actionNode.modal.title')}</h2>
                    <MdClose className={'cursor-pointer'} onClick={props.onCloseModal} size={18}/>
                </div>
                <div className='xyflow-modal-divider'></div>
                <div className='xyflow-modal-content'>
                    <div className='add-action-modal-content'>
                        <div className={'mt-4'}>
                            <label htmlFor='type'>{t('actionNode.modal.selectAction')}</label>
                            <Select
                                id='type'
                                value={type}
                                onChange={onTypeChange}
                                options={types}
                                placeholder={t('select')}
                            />
                        </div>
                        <div className={'mt-4'}>
                            <label htmlFor='type'>{t('tags')}</label>
                            <Select
                                id='type'
                                value={selectedGroups}
                                onChange={onGroupChange}
                                options={tags}
                                placeholder={t('selectTag')}
                                isMulti={true}
                            />
                        </div>
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

export default ModalAction;
