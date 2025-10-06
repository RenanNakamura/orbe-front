import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import VerticalBar from '../message/verticalBar/VerticalBar';
import {ConditionConst} from '../../const/ConditionConst';
import {Field} from '../../../../model/flow/Condition';
import {MdOutlineMoreHoriz} from 'react-icons/md';

export interface Props {
    conditions: { field: string, type: string, values: string[] }[];
    tags: { label: string, value: string }[];
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

function Conditions(props: Props) {
    const {conditions, tags, onEdit, onRemove} = props;
    const types = ConditionConst.getAllConditions();
    const {t, i18n} = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [menuActions, setMenuActions] = useState([]);
    const [translate, setTranslate] = useState(null);

    useEffect(() => {
        setMenuActions([
            {
                label: t('edit'),
                onClick: () => handleEdit(selectedIndex),
            },
            {
                label: t('delete'),
                onClick: () => handleRemove(selectedIndex),
            },
        ]);

        setTranslate({
            notFound: t('notFound'),
            unknownCondition: t('unknownCondition'),
        });
    }, [i18n.language, selectedIndex]);

    const handleEdit = (index) => {
        onEdit(index);
        onClickOutsideMenuActions();
    };

    const handleRemove = (index) => {
        onRemove(index);
        onClickOutsideMenuActions();
    };

    const onClickMenuActions = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    const onClickOutsideMenuActions = () => {
        setSelectedIndex(null);
    };

    const typeLabel = (type) => {
        const label = types.find(item => item.value === type)?.label;

        if (!label) {
            return translate?.unknownCondition;
        }

        return t(label);
    };

    const valueLabel = (field, value): string => {
        if (field === Field.tag) {
            const tag = tags?.find(ta => ta.value === value);
            return tag ? tag.label : translate?.notFound;
        }

        return value;
    };

    return (
        <div>
            {conditions?.map((condition, index) => (
                <div key={index} className='f-condition shadow-2'>
                    <div className={'flex justify-end'}>
                        <MdOutlineMoreHoriz
                            className={'cursor-pointer'}
                            size={16}
                            onClick={(event) => onClickMenuActions(index, event)}
                        />

                        {selectedIndex === index && (
                            <div className='absolute nodrag nopan ml-2 z-10 mt-3'>
                                <VerticalBar options={menuActions}
                                             onClickOutside={onClickOutsideMenuActions}></VerticalBar>
                            </div>
                        )}
                    </div>
                    <div className={'content'}>
                        <div className={'-mt-4'}>
                            {
                                <>
                                    <div className={'flex flex-row'}>
                                        <span>{t(condition.field)}</span>
                                    </div>
                                    <div className={'flex flex-row items-end'}>
                                        <span className={'font-bold text-primary'}>
                                            {typeLabel(condition?.type)}
                                        </span>
                                        <span className='ml-1 text-gray text-xs'>
                                                {condition?.values?.map(value => valueLabel(condition.field, value))?.join(', ')}
                                        </span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Conditions;
