import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow} from '@xyflow/react';
import Messages from '../../component/message/Messages';
import Header from '../../component/node/header/Header';
import {v4 as uuidv4} from 'uuid';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {Type} from '../../../../model/flow/Message';
import MessageBar from '../../component/message/messageBar/MessageBar';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import Section from '../../component/section/Section';
import {MdAdd, MdFormatListBulleted} from 'react-icons/md';

const ListNode = (props: NodeProps<any>) => {
  const {t, i18n} = useTranslation();

  const [translate, setTranslate] = useState(null);
  const [nodeData, setNodeData] = useState(props.data);
  const [editingMessage, setEditingMessage] = useState(null);
  const [sections, setSections] = useState(nodeData?.sections || [generateSection()]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletedRowIds, setDeletedRowIds] = useState([]);
  const [isNodeValid, setIsNodeValid] = useState(null);
  const {setNodes, setEdges} = useReactFlow();

  useEffect(() => {
    setTranslate({
      title: t('listNode.title'),
      alertMessage: t('listNode.alert.message'),
      validationAlert: t('messages.validation.notEmpty'),
      listNodeButtonPlaceholder: t('listNode.button.placeholder'),
      addOption: t('section.row.add')
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
      sections,
    }));

    onValidateNode();
  }, [sections]);

  useLayoutEffect(() => {
    setEdges((edges) => edges.filter((edge) => !deletedRowIds.includes(edge.sourceHandle)));
  }, [deletedRowIds]);

  const onValidateNode = async () => {
    setIsNodeValid(await NodeValidationService.validate(nodeData));
  };

  const onAddMessage = (message) => {
    if (message) {
      setNodeData((prevNode) => {
        return {
          ...prevNode,
          body: message?.body,
        };
      });

      setEditingMessage(null);
      setEditingIndex(null);
    }
  };

  const onEditMessage = (index: number) => {
    setEditingIndex(index);
    setEditingMessage({type: 'TEXT', body: nodeData.body});
  };

  const onDeleteMessage = () => {
    setNodeData((prevNode) => {
      return {
        ...prevNode,
        body: '',
      };
    });
  };

  const onButtonChange = (event) => {
    setNodeData((prevListNode) => {
      return {
        ...prevListNode,
        button: event?.target?.value || ''
      };
    });
  };

  const onAddSection = () => {
    setSections((prevSections) => prevSections.concat(generateSection()));
  };

  const onDeleteSection = (i) => {
    setSections((prevSections) => {
      const deletedSection = prevSections[i];

      if (deletedSection) {
        const rowIdsToDelete = deletedSection?.rows?.map(row => row.id);
        setDeletedRowIds(rowIdsToDelete);
      }

      return prevSections.filter((_, index) => index !== i);
    });
  };

  const onEditSectionTitle = (sectionIndex: number, updatedTitle: string) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === sectionIndex
          ? {...section, title: updatedTitle}
          : section
      )
    );
  };

  const onAddRow = (sectionIndex) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            rows: [
              ...section?.rows,
              {
                id: uuidv4(),
                title: '',
                description: ''
              }
            ],
          }
          : section
      )
    );
  };

  const onDeleteRow = (sectionIndex, rowIndex) => {
    setSections((prevSections) => {
      return prevSections.map((section, i) => {
        if (i === sectionIndex) {
          const deletedRow = section?.rows?.[rowIndex];

          if (deletedRow) {
            setDeletedRowIds([deletedRow.id]);
          }

          return {
            ...section,
            rows: section.rows.filter((_, rowIdx) => rowIdx !== rowIndex),
          };
        }
        return section;
      });
    });
  };

  const onEditRow = (sectionIndex, rowIndex, updatedRow) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === sectionIndex
          ? {
            ...section,
            rows: section?.rows?.map((row, j) => j === rowIndex ? updatedRow : row),
          }
          : section
      )
    );
  };

  const onRowMaxQuantity = (sectionIndex) => {
    if (!sections || !sections[sectionIndex]) {
      return false;
    }

    return sections[sectionIndex]?.rows?.length >= 10;
  };

  const onSectionsMaxQuantity = () => {
    return sections?.length && sections.length >= 10;
  };

  return (
    <>
      <div className={`list-node shadow-4 ${isNodeValid === false ? 'invalid' : ''}`}>
        <Toolbar id={nodeData.id} show={props?.selected}/>
        <Header icon={MdFormatListBulleted}
                iconCss={'bg-primary'}
                title={translate?.title}
                isNodeValid={isNodeValid}
                alertMessage={translate?.alertMessage}
        />
        <div className='body'>
          <div className={'messages'}>
            {!nodeData?.body ? (
              <div className={'empty'}>{translate?.validationAlert}</div>
            ) : (
              <div>
                <Messages messages={[{type: Type.TEXT, body: nodeData?.body}]}
                          editingIndex={editingIndex}
                          onEdit={onEditMessage}
                          onRemove={onDeleteMessage}/>
              </div>
            )}
          </div>
        </div>

        <MessageBar message={editingMessage}
                    onSend={onAddMessage}
                    maxLength={4096}
                    hideMediaOption={true}
        ></MessageBar>

        <div className={'list-node-button xyflow-node-background-color p-4 border-b'}>
          <input type='text'
                 className={'button outline-none text-center w-full nodrag nopan nowheel'}
                 placeholder={translate?.listNodeButtonPlaceholder}
                 maxLength={20}
                 value={nodeData?.button || ''}
                 onChange={(event) => onButtonChange(event)}
          />
        </div>

        <div className={'xyflow-node-background-color border-b'}>
          {
            sections?.length && (
              sections.map((section, i) => (
                <React.Fragment key={i}>
                  <Section
                    title={section.title}
                    rows={section.rows}
                    onDeleteSection={sections.length > 1 ? () => onDeleteSection(i) : undefined}
                    onDeleteRow={(rowIndex) => onDeleteRow(i, rowIndex)}
                    onEditRow={(rowIndex, updatedRow) => onEditRow(i, rowIndex, updatedRow)}
                    onEditSectionTitle={(updatedTitle) => onEditSectionTitle(i, updatedTitle)}
                  />
                  <div className={'w-full text-center mb-2'}
                       style={{
                         pointerEvents: onRowMaxQuantity(i) ? 'none' : 'auto',
                         opacity: onRowMaxQuantity(i) ? 0.5 : 1
                       }}>
                    <button className={'f-btn f-btn-primary text-primary'}
                            onClick={() => onAddRow(i)}>
                      {translate?.addOption}
                    </button>
                  </div>
                </React.Fragment>
              ))
            )
          }
        </div>
        <div
          className='flex flex-row justify-end p-2 xyflow-node-background-color xyflow-node-border-radius-b-10'>
          <MdAdd
            className={'text-primary cursor-pointer'}
            size={24}
            onClick={onAddSection}
            style={{
              pointerEvents: onSectionsMaxQuantity() ? 'none' : 'auto',
              opacity: onSectionsMaxQuantity() ? 0.5 : 1
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

const generateSection = () => {
  return {
    title: '',
    rows: [
      {
        id: uuidv4(),
        title: '',
        description: ''
      },
    ]
  };
};

export default memo(ListNode);

