import React, {useEffect, useState} from 'react';
import {Action} from '../../../../model/flow/Action';
import {ActionConst} from '../../const/ActionConst';
import {useTranslation} from 'react-i18next';
import VerticalBar from '../message/verticalBar/VerticalBar';
import {MdOutlineMoreHoriz} from 'react-icons/md';

export interface Props {
    actions: Action[];
    groups: { label: string, value: string }[];
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

function Actions(props: Props) {
    const {actions, groups, onEdit, onRemove} = props;
    const types = ActionConst.getActions();
    const {t, i18n} = useTranslation();
    const [actionSelectedIndex, setActionSelectedIndex] = useState(null);
    const [menuActions, setMenuActions] = useState([]);
    const [translate, setTranslate] = useState(null);

    useEffect(() => {
        setMenuActions([
            {
                label: t('edit'),
                onClick: () => handleEdit(actionSelectedIndex),
            },
            {
                label: t('delete'),
                onClick: () => handleRemove(actionSelectedIndex),
            },
        ]);

        setTranslate({
            notFound: t('notFound'),
            unknownAction: t('unknownAction'),
        });
    }, [i18n.language, actionSelectedIndex]);

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
        setActionSelectedIndex(actionSelectedIndex === index ? null : index);
    };

    const onClickOutsideMenuActions = () => {
        setActionSelectedIndex(null);
    };

    const typeLabel = (type) => {
        return types.find(item => item.value === type)?.label || translate?.unknownAction;
    };

    const groupName = (value): string => {
        const group = groups.find(g => g.value === value);
        return group ? group.label : translate?.notFound;
    };

    return (
        <div>
            {actions?.map((action, index) => (
                <div key={index} className='f-action shadow-2'>
                    <div className={'flex flex-row justify-end'}>
                        <MdOutlineMoreHoriz
                            className={'cursor-pointer'}
                            size={16}
                            onClick={(event) => onClickMenuActions(index, event)}
                        />

                        {actionSelectedIndex === index && (
                            <div className='absolute nodrag nopan ml-2 z-10 mt-3'>
                                <VerticalBar options={menuActions}
                                             onClickOutside={onClickOutsideMenuActions}></VerticalBar>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className={'-mt-4'}>
                            {typeLabel(action?.type)}
                        </div>
                    </div>
                    <div>
                        <div className={'groups'}>
                            {action.values.map((value) => groupName(value)).join(', ')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Actions;
