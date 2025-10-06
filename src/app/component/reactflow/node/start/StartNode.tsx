import React, {memo, useEffect, useState} from 'react';
import {Handle, Position, useReactFlow} from '@xyflow/react';
import {createPortal} from 'react-dom';
import ModalTrigger from './modal/ModalTrigger';
import {TriggerType} from '../../../../model/flow/Trigger';
import Header from '../../component/node/header/Header';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import {TriggerConst} from '../../const/TriggerConst';
import VerticalBar from '../../component/message/verticalBar/VerticalBar';
import {MdAdd, MdOutlineMoreHoriz, MdPlayArrow} from 'react-icons/md';

const StartNode = ({data}) => {
    const {t, i18n} = useTranslation();

    const [translate, setTranslate] = useState(null);
    const [startNode, setStartNode] = useState(data);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isNodeValid, setIsNodeValid] = useState(null);
    const {setNodes} = useReactFlow();
    const [actionSelectedIndex, setActionSelectedIndex] = useState(null);
    const [menuActions, setMenuActions] = useState([]);

    const TRIGGER_TYPE_LABELS = TriggerConst.getTriggerTypeLabels();
    const TRIGGER_COMPARISON_LABELS = TriggerConst.getTriggerComparisonLabels();

    useEffect(() => {
        setTranslate({
            title: t('startNode.title'),
            alertMessage: t('startNode.alert.message'),
            triggers: t('startNode.triggers'),
        });

        setMenuActions([
            {
                label: t('edit'),
                onClick: () => onOpenModal(actionSelectedIndex),
            },
            {
                label: t('delete'),
                onClick: () => onDeleteTrigger(actionSelectedIndex),
            },
        ]);

    }, [i18n.language, actionSelectedIndex]);

    useEffect(() => {
        setNodes((nodes) => nodes.map(node => node.id === startNode.id ? {...node, data: startNode} : node));
        onValidateNode();
    }, [startNode]);

    const onValidateNode = async () => {
        setIsNodeValid(await NodeValidationService.validate(startNode));
    };

    const onOpenModal = (index) => {
        setEditingIndex(index);
        setModalOpen(true);
        onClickOutsideMenuActions();
    };

    const onCloseModal = () => {
        setModalOpen(false);
    };

    const onAddTrigger = (trigger) => {
        const updatedTriggers = startNode?.triggers || [];

        if (editingIndex !== null) {
            updatedTriggers[editingIndex] = trigger;
        } else {
            updatedTriggers.push(trigger);
        }

        setStartNode({...startNode, triggers: updatedTriggers});
        setModalOpen(false);
    };

    const onDeleteTrigger = (index) => {
        if (startNode && startNode?.triggers) {
            const updatedTriggers = [...startNode.triggers.slice(0, index), ...startNode.triggers.slice(index + 1)];
            setStartNode({...startNode, triggers: updatedTriggers});
            onClickOutsideMenuActions();
        }
    };

    const onClickMenuActions = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setActionSelectedIndex(actionSelectedIndex === index ? null : index);
    };

    const onClickOutsideMenuActions = () => {
        setActionSelectedIndex(null);
    };

    return (
        <div className={`rounded-md bg-white start-node shadow-2 ${isNodeValid === false ? 'invalid' : ''}`}>
            <Header
                icon={MdPlayArrow}
                iconCss={'border border-primary-600'}
                iconColor={'text-primary-600'}
                title={translate?.title}
                isNodeValid={isNodeValid}
                alertMessage={translate?.alertMessage}
            />
            <div className='hint'>
                <span>{t('startNode.hint')}</span>
            </div>
            <div className='config'>
                <div className='description'>
                    <span>{translate?.triggers}</span>
                </div>
            </div>
            <div className='triggers'>
                {
                    startNode?.triggers?.map((trigger, index) => (
                        <div key={index} className='trigger'>
                            <div className={'description'}>
                                <span className={'text-sm font-medium'}>{TRIGGER_TYPE_LABELS[trigger.type]}</span>
                                {
                                    trigger.type === TriggerType.WHATSAPP_KEYWORD && (
                                        <div>
                                            <span
                                                className={'text-primary-600 font-medium'}>{TRIGGER_COMPARISON_LABELS[trigger?.comparisonType]}</span>
                                            <span className={'ml-1 text-gray-400 text-xs'}>{trigger?.words.join(', ')}</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={'flex flex-row'}>
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
                        </div>
                    ))
                }

                <div className='flex flex-row justify-end p-1'>
                    <MdAdd className={'text-primary-600 cursor-pointer'}
                           size={24}
                           onClick={() => onOpenModal(null)}
                    />
                </div>
            </div>
            {
                modalOpen && createPortal(
                    <ModalTrigger
                        onCloseModal={onCloseModal}
                        onSubmit={onAddTrigger}
                        onCancel={onCloseModal}
                        trigger={editingIndex !== null ? startNode.triggers[editingIndex] : null}
                    />,
                    document.body)
            }

            <Handle
                type='source'
                className='xyflow-handle top-8'
                position={Position.Right}
                id={startNode.id}
            />
        </div>
    );
};

export default memo(StartNode);
