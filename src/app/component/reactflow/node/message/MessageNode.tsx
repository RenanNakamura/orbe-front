import React, {memo, useEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Messages from '../../component/message/Messages';
import Header from '../../component/node/header/Header';
import Toolbar from '../../component/node/toolbar/Toolbar';
import MessageBar from '../../component/message/messageBar/MessageBar';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import {MdMessage} from 'react-icons/md';

const MessageNode = (props: NodeProps<any>) => {
    const {t, i18n} = useTranslation();

    const [translate, setTranslate] = useState(null);
    const [nodeData, setNodeData] = useState(props.data);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isNodeValid, setIsNodeValid] = useState(null);
    const {setNodes} = useReactFlow();

    useEffect(() => {
        setTranslate({
            title: t('messageNode.title'),
            alertMessage: t('messageNode.alert.message'),
            validationMessageNotEmpty: t('messages.validation.notEmpty'),
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

    const onValidateNode = async () => {
        setIsNodeValid(await NodeValidationService.validate(nodeData));
    };

    const onAddMessage = (newMessage) => {
        if (!newMessage) {
            return;
        }

        setNodeData((prevNode) => {
            const prevMessages = prevNode?.messages || [];
            const isEditing = editingIndex !== null;
            const existingMessage = isEditing ? prevMessages[editingIndex] : {};

            const message = {
                ...existingMessage,
                type: newMessage.type,
                body: newMessage.body,
            };

            switch (newMessage.type) {
                case 'IMAGE':
                case 'VIDEO':
                case 'DOCUMENT':
                    if (newMessage?.isChangedOrNewMedia) {
                        message.link = newMessage.link;
                        message.originalFilename = newMessage.originalFilename;
                        message.filename = '';
                    }
                    break;

                case 'CONTACT':
                    message.name = newMessage.name;
                    message.phones = newMessage.phones;
                    break;
                default:
                    message.name = '';
                    message.phones = '';
                    message.link = '';
                    message.originalFilename = '';
                    message.filename = '';
            }

            const updatedMessages = isEditing
                ? prevMessages.map((msg, index) => (index === editingIndex ? message : msg))
                : [...prevMessages, message];

            return {...prevNode, messages: updatedMessages};
        });

        setEditingMessage(null);
        setEditingIndex(null);
    };

    const onEditMessage = (index: number) => {
        const message = nodeData.messages[index];

        setEditingIndex(index);
        setEditingMessage(message);
    };

    const onDeleteMessage = (index: number) => {
        setNodeData((prevNode) => {
            const updatedMessages = [...(prevNode?.messages || [])];
            updatedMessages.splice(index, 1);

            return {
                ...prevNode,
                messages: updatedMessages,
            };
        });
    };

    return (
        <>
            <div className={`message-node rounded-md bg-white shadow-md ${isNodeValid === false ? 'invalid' : ''}`}>
                <Toolbar id={nodeData.id} show={props?.selected}/>
                <Header icon={MdMessage}
                        iconCss={'bg-primary-600'}
                        title={translate?.title}
                        isNodeValid={isNodeValid}
                        alertMessage={translate?.alertMessage}
                />
                <div className='relative min-h-14 bg-primary-600/20 pl-4 pt-4 pr-4 pb-2'>
                    <div className={'pl-1 pr-1'}>
                        {!nodeData?.messages || nodeData?.messages?.length === 0 ? (
                            <div className={'italic text-center text-gray-500'}>{translate?.validationMessageNotEmpty}</div>
                        ) : (
                            <div>
                                <Messages messages={nodeData?.messages}
                                          editingIndex={editingIndex}
                                          onEdit={onEditMessage}
                                          onRemove={onDeleteMessage}/>
                            </div>
                        )}
                    </div>
                </div>
                <MessageBar message={editingMessage} onSend={onAddMessage} maxLength={4096}
                            cssClass={'xyflow-node-border-radius-b-10'}></MessageBar>
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


export default memo(MessageNode);
