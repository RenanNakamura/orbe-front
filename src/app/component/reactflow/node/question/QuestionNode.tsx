import React, {memo, useEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Messages from '../../component/message/Messages';
import Header from '../../component/node/header/Header';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {Type} from '../../../../model/flow/Message';
import MessageBar from '../../component/message/messageBar/MessageBar';
import {NodeValidationService} from '../../service/NodeValidationService';
import {Group} from '../../component/groupList/GroupList';
import SelectGroupList from '../../component/selectGroupList/SelectGroupList';
import {Tooltip} from 'react-tooltip';
import {useTranslation} from 'react-i18next';
import {GroupConst} from '../../const/GroupConst';
import { MdHelpOutline, MdQuestionMark } from 'react-icons/md';

const QuestionNode = (props: NodeProps<any>) => {
    const {t, i18n} = useTranslation();

    const groups: Group[] = GroupConst.getContactFieldGroup();
    const timeTypeGroups: Group[] = GroupConst.getTimeIntervalGroup();

    const [translate, setTranslate] = useState(null);
    const [nodeData, setNodeData] = useState({
        ...props.data,
        timeout: props.data?.timeout ?? { value: 5, timeIntervalUnit: 'MINUTES' }
    });
    const [time, setTime] = useState(nodeData?.timeout?.value || 5);
    const [timeIntervalUnit, setTimeIntervalUnit] = useState(nodeData?.timeout?.timeIntervalUnit || 'MINUTES');
    const [editingMessage, setEditingMessage] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [answerField, setAnswerField] = useState(nodeData?.answerField || null);
    const [isNodeValid, setIsNodeValid] = useState(null);
    const {setNodes} = useReactFlow();

    useEffect(() => {
        setTranslate({
            title: t('questionNode.title'),
            alertMessage: t('questionNode.alert.message'),
            validationMessageNotEmpty: t('messages.validation.notEmpty'),
            saveIn: t('answer.save.in'),
            select: t('select'),
            alertSaveIn: t('answer.alert.save.message'),
            answerNotResponse: t('answer.not.response'),
            answerInvalid: t('answer.invalid'),
            alertNotMessage: t('answer.alert.not.message')
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
            answerField,
        }));

        onValidateNode();
    }, [answerField]);

    useEffect(() => {
        setNodeData((prevNode) => ({
            ...prevNode,
            timeout: {
                value: time,
                timeIntervalUnit
            },
        }));

        onValidateNode();
    }, [time, timeIntervalUnit]);

    const onValidateNode = async () => {
        setIsNodeValid(await NodeValidationService.validate(nodeData));
    };

    const onAddMessage = (newMessage) => {
        if (newMessage) {
            setNodeData((prevNode) => {
                return {
                    ...prevNode,
                    text: newMessage?.body,
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

    const onSelectAnswerField = (result) => {
        const field = {
            type: result?.type,
            field: result?.value
        };

        if (field.type && field.field) {
            setAnswerField(field);
        } else {
            setAnswerField(null);
        }
    };

    const handleTimeChange = (e) => {
        const newValue = e.target.value;

        if (/^\d*$/.test(newValue)) {
            setTime(newValue);
        }
    };

    const handleTimeTypeChange = (e) => {
        setTimeIntervalUnit(e?.value);
    };

    return (
        <>
            <div className={`question-node shadow-md rounded-md bg-white ${isNodeValid === false ? 'invalid' : ''}`}>
                <Toolbar id={nodeData.id} show={props?.selected}/>
                <Header icon={MdQuestionMark}
                        iconCss={'bg-primary-600'}
                        title={translate?.title}
                        isNodeValid={isNodeValid}
                        alertMessage={translate?.alertMessage}
                />
                <div className='relative min-h-14 pl-4 pt-4 pr-4 pb-2 bg-primary-600/20'>
                    <div className={'pl-1 pr-1'}>
                        {!nodeData?.text ? (
                            <div className={'italic text-center text-gray-500'}>{translate?.validationMessageNotEmpty}</div>
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

                <MessageBar message={editingMessage} onSend={onAddMessage} maxLength={1024}
                            hideMediaOption={true}></MessageBar>

                <div className={'relative flex xyflow-node-background-color border-t p-2 items-center'}>
                    <span className={'italic text-gray-500 ml-1 mr-2'}>{translate?.saveIn} </span>
                    <SelectGroupList placeholder={translate?.select}
                                     groups={groups}
                                     value={nodeData?.answerField?.field}
                                     onClick={(value) => onSelectAnswerField(value)}></SelectGroupList>
                    <MdHelpOutline
                        className={'ml-1 cursor-pointer text-gray-400'}
                        size={16}
                        data-tooltip-id='hint-answer-field'
                        data-tooltip-content={translate?.alertSaveIn}
                    />
                    <Tooltip id='hint-answer-field'/>
                </div>

                <div className={'flex flex-row relative xyflow-node-background-color border-t p-2 items-center'}>
                    <div className={'flex flex-row'}>
                        <span className={'italic text-gray-500 ml-1 mr-2'}>{translate?.answerNotResponse}</span>
                        <input type='text'
                               className={'outline-none text-center bg-gray-500 rounded-sm w-6 text-white font-medium'}
                               value={time}
                               onChange={handleTimeChange}
                               maxLength={2}/>
                        <div className={'ml-2'}>
                            <SelectGroupList placeholder={translate?.select}
                                             groups={timeTypeGroups}
                                             value={timeIntervalUnit}
                                             onClick={handleTimeTypeChange}></SelectGroupList>
                        </div>
                    </div>

                    <MdHelpOutline
                        className={'ml-1 cursor-pointer text-gray-400'}
                        size={16}
                        data-tooltip-id='hint-answer-field'
                        data-tooltip-content={translate?.alertNotMessage}
                    />
                    <Tooltip id='hint-answer-field'/>

                    <Handle
                        type='source'
                        className={'xyflow-handle'}
                        position={Position.Right}
                        id={'fallback'}
                    />
                </div>

                <div className={'flex flex-row relative xyflow-node-background-color border-t xyflow-node-border-radius-b-10 p-2 items-center'}>
                    <div className={'flex flex-row'}>
                        <span className={'italic text-gray-500 ml-1 mr-2'}>{translate?.answerInvalid}</span>
                    </div>

                    <Handle
                        type='source'
                        className={'xyflow-handle'}
                        position={Position.Right}
                        id={'fail'}
                    />
                </div>

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

export default memo(QuestionNode);

