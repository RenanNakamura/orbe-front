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
            <div className={'f-select-node shadow-md h-auto bg-white rounded-md'}>
                <Toolbar id={data.id} show={props?.selected} hiddenClone={true}/>
                <div className={'header p-2 text-center border-b'}>
                    <div>{t('selectNode.title')}</div>
                    <div className='description text-gray-500 text-xs'>{t('selectNode.subTitle')}</div>
                </div>
                <div>
                    <div className={'pt-4 pl-4 pr-4'}>
                        <div className={'m-2 font-medium text-sm'}>{t('send')}</div>
                        <div className={'flex flex-row flex-wrap'}>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-primary-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.MESSAGE)}>
                                <MdMessage className={'text-primary-600'} size={32}/>
                                <span className={'text-primary-600'}>{t('message')}</span>
                            </div>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-primary-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.QUESTION)}>
                                <MdQuestionMark className={'text-primary-600'} size={32}/>
                                <span className={'text-primary-600'}>{t('question')}</span>
                            </div>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-primary-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.BUTTON)}>
                                <MdSmartButton className={'text-primary-600'} size={32}/>
                                <span className={'text-primary-600'}>{t('buttons.description')}</span>
                            </div>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-primary-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.LIST)}>
                                <MdFormatListBulleted className={'text-primary-600'} size={32}/>
                                <span className={'text-primary-600'}>{t('list.description')}</span>
                            </div>
                        </div>
                    </div>
                    <div className={'other pb-4 pl-4 pr-4'}>
                        <div className={'m-2 font-medium text-sm'}>{t('execute')}</div>
                        <div className={'flex flex-row flex-wrap'}>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-orange-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.ACTION)}>
                                <MdFlashOn className={'text-orange-600'} size={32}/>
                                <span className={'text-orange-600'}>{t('action')}</span>
                            </div>
                            <div
                                className={'min-w-24 p-2 cursor-pointer border-2 border-orange-600 flex flex-col ml-1 mr-1 mb-2 items-center rounded-lg'}
                                onClick={() => onSelectNode(data?.id, NodeType.CONDITION)}>
                                <MdCallSplit className={'text-orange-600'} size={32}/>
                                <span className={'text-orange-600'}>{t('condition')}</span>
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
