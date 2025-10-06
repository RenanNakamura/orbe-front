import React, {memo, useEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Header from '../../component/node/header/Header';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {createPortal} from 'react-dom';
import ModalCondition from './modal/ModalCondition';
import {TagService} from '../../service/TagService';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import Conditions from '../../component/condition/Conditions';
import SelectGroupList from '../../component/selectGroupList/SelectGroupList';
import {Group} from '../../component/groupList/GroupList';
import {GroupConst} from '../../const/GroupConst';
import {MdAdd, MdCallSplit} from 'react-icons/md';

const ConditionNode = (props: NodeProps<any>) => {
  const {t, i18n} = useTranslation();

  const groups: Group[] = GroupConst.getOperatorsGroup();
  const [translate, setTranslate] = useState(null);
  const [data, setData] = useState(props.data);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tags, setTags] = useState([]);
  const [isNodeValid, setIsNodeValid] = useState(null);
  const {setNodes} = useReactFlow();

  useEffect(() => {
    setTranslate({
      title: t('conditionNode.title'),
      alertMessage: t('conditionNode.alert.message'),
      conditionsEmpty: t('conditionNode.conditions.notEmpty'),
      select: t('select'),
      if: t('if'),
      noMatch: t('operator.noMatch'),
    });
  }, [i18n.language]);

  useEffect(() => {
    setNodes((nodes) => nodes.map(node => node.id === data.id
      ? {
        ...node,
        data
      }
      : node));

    onValidateNode();
  }, [data]);

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
          setTags(map);
        }
      } catch (e) {
        console.error('[ConditionNode] - Error fetching tags:', e);
      }
    };

    fetchData();
  }, []);

  const onValidateNode = async () => {
    setIsNodeValid(await NodeValidationService.validate(data));
  };

  const onOpenModal = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };

  const onAddCondition = (condition) => {
    setData((prevNode) => {
      const conditions = prevNode?.conditions || [];

      if (editingIndex !== null) {
        conditions[editingIndex] = condition;
      } else {
        conditions.push(condition);
      }

      return {
        ...prevNode,
        conditions,
      };
    });

    setModalOpen(false);
  };

  const onDeleteCondition = (index: number) => {
    setData((prevNode) => {
      const conditions = [...(prevNode?.conditions || [])];
      conditions.splice(index, 1);

      return {
        ...prevNode,
        conditions
      };
    });
  };

  const onSelectOperator = (operator) => {
    setData((prevNode) => {
      return {
        ...prevNode,
        operator: operator?.value,
      };
    });
  };

  return (
    <>
      <div className={`condition-node rounded-md bg-white shadow-md ${isNodeValid === false ? 'invalid' : ''}`}>
        <Toolbar id={data.id} show={props?.selected}/>
        <Header icon={MdCallSplit}
                iconCss={'bg-orange-600'}
                title={translate?.title}
                alertMessage={translate?.alertMessage}
                isNodeValid={isNodeValid}/>
        <div className='relative min-h-14 bg-amber-600/20 pl-4 pt-4 pr-4 pb-2'>
          <div className={'pl-1 pr-1'}>
            {!data?.conditions || data?.conditions?.length === 0 ? (
              <div className={'italic text-center text-gray-500'}>{translate?.conditionsEmpty}</div>
            ) : (
              <div>
                <Conditions conditions={data?.conditions}
                            tags={tags}
                            onEdit={onOpenModal}
                            onRemove={onDeleteCondition}></Conditions>
              </div>
            )}
          </div>
        </div>
        <div className={'xyflow-node-background-color'}>
          <div className={'flex flex-col'}>
            <div className={'flex flex-row border-b'}>
              <div className={'flex flex-row w-11/12 italic text-gray-500 p-2 gap-1'}>
                <span>{translate?.if}</span>
                <SelectGroupList placeholder={translate?.select}
                                 groups={groups}
                                 value={data?.operator}
                                 onClick={(value) => onSelectOperator(value)}></SelectGroupList>
              </div>
              <div className={'w-1/12 justify-items-end'}>
                <Handle
                  type='source'
                  className='relative xyflow-handle top-5'
                  position={Position.Right}
                  id={'match'}
                />
              </div>
            </div>
            <div className={'flex flex-row border-b'}>
              <div className={'flex flex-row w-11/12 italic text-gray-500 p-2 gap-1'}>
                <span>{translate?.noMatch}</span>
              </div>
              <div className={'w-1/12 justify-items-end'}>
                <Handle
                  type='source'
                  className='relative xyflow-handle top-5'
                  position={Position.Right}
                  id={'noMatch'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row justify-end xyflow-node-background-color xyflow-node-border-radius-b-10 p-2'>
          <MdAdd className={'text-primary-600 cursor-pointer'}
                 size={24}
                 onClick={() => onOpenModal(null)}/>
        </div>
        {
          modalOpen && createPortal(
            <ModalCondition
              onCloseModal={onCloseModal}
              onSubmit={onAddCondition}
              onCancel={onCloseModal}
              condition={editingIndex !== null ? data.conditions[editingIndex] : null}
              tags={tags}
            />,
            document.body)
        }
        <Handle
          type='target'
          className='xyflow-handle top-8'
          position={Position.Left}
          id={data.id}
        />
      </div>
    </>
  );
};

export default memo(ConditionNode);
