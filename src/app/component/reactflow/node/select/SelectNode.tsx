import React, {memo} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {useTranslation} from 'react-i18next';
import {NodeType} from '../../../../model/flow/WorkflowNode';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {MdCallSplit, MdFlashOn, MdFormatListBulleted, MdMessage, MdQuestionMark, MdSmartButton} from 'react-icons/md';

const SelectNode = (props: NodeProps<any> & { onSelectNode: (id: string, type: NodeType) => void }) => {
    const {t} = useTranslation();
    const {data, onSelectNode} = props;

    return (
        <>
            <div className={'f-select-node shadow-4'}>
                <Toolbar id={data.id} show={props?.selected} hiddenClone={true}/>
                <div className={'header'}>
                    <div className='title'>{t('selectNode.title')}</div>
                    <div className='description'>{t('selectNode.subTitle')}</div>
                </div>
                <div className={'body'}>
                    <div className={'send pt-4 pl-4 pr-4'}>
                        <div className={'title'}>{t('send')}</div>
                        <div className={'content flex flex-row flex-wrap'}>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-primary flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.MESSAGE)}>
                                <MdMessage className={'text-primary'} size={32}/>
                                <span className={'text-primary'}>{t('message')}</span>
                            </div>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-primary flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.QUESTION)}>
                                <MdQuestionMark className={'text-primary'} size={32}/>
                                <span className={'text-primary'}>{t('question')}</span>
                            </div>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-primary flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.BUTTON)}>
                                <MdSmartButton className={'text-primary'} size={32}/>
                                <span className={'text-primary'}>{t('buttons.description')}</span>
                            </div>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-primary flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.LIST)}>
                                <MdFormatListBulleted className={'text-primary'} size={32}/>
                                <span className={'text-primary'}>{t('list.description')}</span>
                            </div>
                        </div>
                    </div>
                    <div className={'other pb-4 pl-4 pr-4'}>
                        <div className={'title'}>{t('execute')}</div>
                        <div className={'content flex flex-row flex-wrap'}>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-orange flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.ACTION)}>
                                <MdFlashOn className={'text-orange'} size={32}/>
                                <span className={'text-orange'}>{t('action')}</span>
                            </div>
                            <div
                                className={'item p-2 cursor-pointer border-2 border-orange flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.CONDITION)}>
                                <MdCallSplit className={'text-orange'} size={32}/>
                                <span className={'text-orange'}>{t('condition')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Handle
                    type='target'
                    className='xyflow-handle top-8'
                    position={Position.Left}
                    id={data?.id}
                />
            </div>
        </>
    );
};


export default memo(SelectNode);
