import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Messages from '../../component/message/Messages';
import Header from '../../component/node/header/Header';
import {v4 as uuidv4} from 'uuid';
import Toolbar from '../../component/node/toolbar/Toolbar';
import Buttons from '../../component/button/Buttons';
import {Type} from '../../../../model/flow/Message';
import MessageBar from '../../component/message/messageBar/MessageBar';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import {MdAdd, MdSmartButton} from 'react-icons/md';

const ButtonNode = (props: NodeProps<any>) => {
    const {t, i18n} = useTranslation();

    const [translate, setTranslate] = useState(null);
    const [nodeData, setNodeData] = useState(props.data);
    const [editingMessage, setEditingMessage] = useState(null);
    const [buttons, setButtons] = useState(nodeData?.buttons || [generateButton()]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isNodeValid, setIsNodeValid] = useState(null);
    const [deletedButtonId, setDeletedButtonId] = useState(null);
    const {setNodes, setEdges} = useReactFlow();

    useEffect(() => {
        setTranslate({
            title: t('buttonNode.title'),
            alertMessage: t('buttonNode.alert.message'),
            validationAlert: t('messages.validation.notEmpty'),
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
        setNodeData((prevNode) => ({
            ...prevNode,
            buttons,
        }));

        onValidateNode();
    }, [buttons]);

    useLayoutEffect(() => {
        setEdges((edges) => edges.filter((edge) => edge.sourceHandle !== deletedButtonId));
    }, [deletedButtonId]);

    const onValidateNode = async () => {
        setIsNodeValid(await NodeValidationService.validate(nodeData));
    };

    const onAddMessage = (message) => {
        if (message) {
            setNodeData((prevNode) => {
                return {
                    ...prevNode,
                    text: message?.body,
                };
            });

            setEditingMessage(null);
            setEditingIndex(null);
        }
    };

    const onEditMessage = (index: number) => {
        setEditingIndex(index);
        setEditingMessage({type: 'TEXT', body: nodeData.text});
    };

    const onDeleteMessage = () => {
        setNodeData((prevNode) => {
            return {
                ...prevNode,
                text: '',
            };
        });
    };

    const onButtonTextChange = (event, index) => {
        const newText = event.target.value;
        setButtons((prevButtons) => {
            const updatedButtons = [...prevButtons];
            updatedButtons[index] = {...updatedButtons[index], text: newText};
            return updatedButtons;
        });
    };

    const onDeleteButton = (index) => {
        setButtons((prevButtons) => {
            const updatedButtons = [...prevButtons];
            const deletedButton = updatedButtons.splice(index, 1);

            if (deletedButton?.length) {
                setDeletedButtonId(deletedButton[0].id);
            }

            return updatedButtons;
        });
    };

    const onAddButton = () => {
        if (buttonMaxQuantity()) {
            return;
        }
        setButtons((prevButtons) => prevButtons.concat(generateButton()));
    };

    const buttonMaxQuantity = () => {
        return buttons.length && buttons.length >= 3;
    };

    return (
        <>
            <div className={`button-node rounded-md bg-white shadow-4 ${isNodeValid === false ? 'invalid' : ''}`}>
                <Toolbar id={nodeData.id} show={props?.selected}/>
                <Header icon={MdSmartButton}
                        iconCss={'bg-primary'}
                        title={translate?.title}
                        isNodeValid={isNodeValid}
                        alertMessage={translate?.alertMessage}
                />
                <div className='relative min-h-14 bg-primary-600/20 pl-4 pt-4 pr-4 pb-2'>
                    <div className={'pl-1 pr-1'}>
                        {!nodeData?.text ? (
                            <div className={'italic text-center'}>{translate?.validationAlert}</div>
                        ) : (
                            <div>
                                <Messages messages={[{type: Type.TEXT, body: nodeData?.text}]}
                                          editingIndex={editingIndex}
                                          onEdit={onEditMessage}
                                          onRemove={onDeleteMessage}/>
                            </div>
                        )}
                    </div>
                </div>

                <MessageBar message={editingMessage}
                            onSend={onAddMessage}
                            maxLength={1024}
                            hideMediaOption={true}
                ></MessageBar>

                <div>
                    <Buttons buttons={buttons}
                             onRemove={onDeleteButton}
                             onEdit={onButtonTextChange}/>
                </div>
                <div className='flex flex-row justify-end xyflow-node-background-color xyflow-node-border-radius-b-10 p-2'>
                    <MdAdd className={'text-primary-600 cursor-pointer'}
                           size={24}
                           onClick={onAddButton}
                           style={{
                               pointerEvents: buttonMaxQuantity() ? 'none' : 'auto',
                               opacity: buttonMaxQuantity() ? 0.5 : 1
                           }}
                    />
                </div>

                <Handle
                    type='target'
                    className='xyflow-handle top-8'
                    position={Position.Left}
                    id={nodeData.id}
                />
            </div>
        </>
    );
};

const generateButton = () => {
    return {
        id: uuidv4(),
        text: ''
    };
};

export default memo(ButtonNode);
