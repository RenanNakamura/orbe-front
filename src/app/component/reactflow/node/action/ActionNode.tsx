import React, {memo, useEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Header from '../../component/node/header/Header';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {createPortal} from 'react-dom';
import ModalAction from './modal/ModalAction';
import Actions from '../../component/action/Actions';
import {TagService} from '../../service/TagService';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import {MdAdd, MdFlashOn} from 'react-icons/md';

const ActionNode = (props: NodeProps<any>) => {
    const {t, i18n} = useTranslation();

    const [translate, setTranslate] = useState(null);
    const [nodeData, setNodeData] = useState(props.data);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [groups, setGroups] = useState([]);
    const [isNodeValid, setIsNodeValid] = useState(null);
    const {setNodes} = useReactFlow();

    useEffect(() => {
        setTranslate({
            title: t('actionNode.title'),
            alertMessage: t('actionNode.alert.message'),
            actionsEmpty: t('actionNode.actions.notEmpty')
        });
    }, [i18n.language]);

    useEffect(() => {
        setNodes((nodes) => nodes.map(node => node.id === nodeData.id
            ? {
                ...node,
                data: nodeData
            }
            : node));

        onValidateNode();
    }, [nodeData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TagService.findAll();
                if (response.data && response.data.content) {
                    const map = response.data
                        .content
                        .map(tag => {
                            return {value: tag.id, label: tag.description};
                        });
                    setGroups(map);
                }
            } catch (e) {
                console.error('[ActionNode] - Error fetching tags:', e);
            }
        };

        fetchData();
    }, []);

    const onValidateNode = async () => {
        setIsNodeValid(await NodeValidationService.validate(nodeData));
    };

    const onOpenModal = (index) => {
        setEditingIndex(index);
        setModalOpen(true);
    };

    const onCloseModal = () => {
        setModalOpen(false);
    };

    const onAddAction = (action) => {
        setNodeData((prevNode) => {
            const updatedActions = prevNode?.actions || [];

            if (editingIndex !== null) {
                updatedActions[editingIndex] = action;
            } else {
                updatedActions.push(action);
            }

            return {
                ...prevNode,
                actions: updatedActions,
            };
        });

        setModalOpen(false);
    };

    const onDeleteAction = (index: number) => {
        setNodeData((prevNode) => {
            const updatedActions = [...(prevNode?.actions || [])];
            updatedActions.splice(index, 1);

            return {
                ...prevNode,
                actions: updatedActions,
            };
        });
    };

    return (
        <>
            <div className={`action-node bg-white shadow-md rounded-md ${isNodeValid === false ? 'invalid' : ''}`}>
                <Toolbar id={nodeData.id} show={props?.selected}/>
                <Header title={translate?.title}
                        icon={MdFlashOn}
                        iconCss={'bg-orange-600'}
                        alertMessage={translate?.alertMessage}
                        isNodeValid={isNodeValid}/>
                <div className='relative min-w-14 pl-4 pt-4 pr-4 pb-2 bg-amber-600/20'>
                    <div className={'pl-1 pr-1'}>
                        {!nodeData?.actions || nodeData?.actions?.length === 0 ? (
                            <div className={'italic text-center text-gray-500'}>{translate?.actionsEmpty}</div>
                        ) : (
                            <div>
                                <Actions actions={nodeData?.actions}
                                         groups={groups}
                                         onEdit={onOpenModal}
                                         onRemove={onDeleteAction}></Actions>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-row justify-end xyflow-node-background-color xyflow-node-border-radius-b-10 p-2'>
                    <MdAdd className={'text-primary-600 cursor-pointer'}
                           size={24}
                           onClick={() => onOpenModal(null)}/>
                </div>
                {
                    modalOpen && createPortal(
                        <ModalAction
                            onCloseModal={onCloseModal}
                            onSubmit={onAddAction}
                            onCancel={onCloseModal}
                            action={editingIndex !== null ? nodeData.actions[editingIndex] : null}
                            tags={groups}
                        />,
                        document.body)
                }
                <Handle
                    type='target'
                    className='xyflow-handle top-8'
                    position={Position.Left}
                    id={nodeData.id}
                />
                <Handle
                    type='source'
                    className='xyflow-handle top-8'
                    position={Position.Right}
                    id={nodeData.id}
                />
            </div>
        </>
    );
};

export default memo(ActionNode);
