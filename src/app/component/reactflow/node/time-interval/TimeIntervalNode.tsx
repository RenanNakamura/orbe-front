import React, {memo, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Handle, NodeProps, Position, useReactFlow, useUpdateNodeInternals} from '@xyflow/react';
import Header from '../../component/node/header/Header';
import Toolbar from '../../component/node/toolbar/Toolbar';
import {createPortal} from 'react-dom';
import {NodeValidationService} from '../../service/NodeValidationService';
import {useTranslation} from 'react-i18next';
import {MdAdd, MdOutlineMoreHoriz, MdSchedule} from 'react-icons/md';
import Select from 'react-select';
import moment from 'moment-timezone';
import {v4 as uuidv4} from 'uuid';
import ModalTimeInterval from './modal/ModalTimeInterval';
import {TimeInterval} from '../../../../model/flow/WorkflowNode';
import VerticalBar from '../../component/message/verticalBar/VerticalBar';

const TimeIntervalNode = (props: NodeProps<any>) => {
  const {t, i18n} = useTranslation();

  const [timezones, setTimezones] = useState([]);
  const [translate, setTranslate] = useState(null);
  const [data, setData] = useState(props.data);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isNodeValid, setIsNodeValid] = useState(null);
  const {setNodes, setEdges} = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [deletedIntervalId, setDeletedIntervalId] = useState(null);
  const [menuActions, setMenuActions] = useState([]);

  useEffect(() => {
    const loadTimezones = () => {
      let tzNames: { label: string, value: string }[] = [];

      try {
        tzNames = moment.tz.names()
          .map(tz => {
            const offset = moment.tz(tz).utcOffset();
            const sign = offset >= 0 ? '+' : '-';
            const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
            const minutes = String(Math.abs(offset) % 60).padStart(2, '0');

            return {label: `${tz} (UTC${sign}${hours}:${minutes})`, value: tz};
          });
      } catch (e) {
        console.error('m=useEffect; msg=Moment Timezone failed to load', e);
      }

      setTimezones(tzNames.map(tz => ({value: tz.value, label: tz.label})));
    };

    loadTimezones();
  }, []);

  useEffect(() => {
    setTranslate({
      title: t('timeIntervalNode.title'),
      alertMessage: t('timeIntervalNode.alert.message'),
      intervalsEmpty: t('timeIntervalNode.intervals.notEmpty'),
      timezoneLabel: t('timeIntervalNode.timezone.label'),
      timezonePlaceholder: t('timeIntervalNode.timezone.placeholder'),
      noMatch: t('timeIntervalNode.noMatch'),
      edit: t('edit'),
      delete: t('delete'),
    });

    setMenuActions([
      {
        label: t('edit'),
        onClick: () => handleEdit(selectedIndex),
      },
      {
        label: t('delete'),
        onClick: () => handleDelete(selectedIndex),
      },
    ]);
  }, [i18n.language, selectedIndex]);

  useEffect(() => {
    setTimeout(() => {
      setNodes((nodes) => nodes.map(node => node.id === data.id
        ? {
          ...node,
          data
        }
        : node));

      // Force ReactFlow to recalculate handle positions
      updateNodeInternals(data.id);

      onValidateNode();
    }, 50)
  }, [data]);

  useEffect(() => {
    if (data?.timezone && timezones.length > 0) {
      const option = timezones.find(tz => tz.value === data.timezone);

      if (option) {
        setSelectedTimezone(option);
      } else {
        setSelectedTimezone({
          value: data.timezone,
          label: data.timezone
        });
      }
    } else {
      setSelectedTimezone(null);
    }
  }, [data?.timezone, timezones]);

  useLayoutEffect(() => {
    setEdges((edges) => edges.filter((edge) => edge.sourceHandle !== deletedIntervalId));
  }, [deletedIntervalId]);

  const onValidateNode = async () => {
    setIsNodeValid(await NodeValidationService.validate(data));
  };

  const onOpenModal = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    if (index !== null) {
      onOpenModal(index);
      onClickOutsideMenuActions();
    }
  };

  const handleDelete = (index) => {
    if (index !== null) {
      onDeleteInterval(index);
      onClickOutsideMenuActions();
    }
  };

  const onClickMenuActions = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  const onClickOutsideMenuActions = () => {
    setSelectedIndex(null);
  };

  const onAddInterval = (interval: TimeInterval) => {
    setData((prevNode) => {
      const intervals = prevNode?.intervals || [];

      if (editingIndex !== null) {
        intervals[editingIndex] = interval;
      } else {
        intervals.push({...interval, id: uuidv4()});
      }

      return {
        ...prevNode,
        intervals,
      };
    });

    setModalOpen(false);
    setEditingIndex(null);
  };

  const onDeleteInterval = (index: number) => {
    setData((prevNode) => {
      const intervals = [...(prevNode?.intervals || [])];

      const deletedInterval = intervals.splice(index, 1);

      if (deletedInterval?.length) {
        setDeletedIntervalId(deletedInterval?.[0]?.id);
      }

      return {
        ...prevNode,
        intervals
      };
    });
  };

  const onSelectTimezone = useCallback((option) => {
    setData((prevNode) => {
      return {
        ...prevNode,
        timezone: option?.value,
      };
    });

    setSelectedTimezone(option);
  }, []);

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime} `;
  };

  return (
    <>
      <div className={`time-interval-node rounded-md bg-white shadow-md ${isNodeValid === false ? 'invalid' : ''} `}>
        <Toolbar id={data.id} show={props?.selected}/>
        <Header icon={MdSchedule}
                iconCss={'bg-orange-600'}
                title={translate?.title}
                alertMessage={translate?.alertMessage}
                isNodeValid={isNodeValid}/>

        {/* Timezone Selection */}
        <div className='xyflow-node-background-color p-4 border-b nodrag nopan'>
          <label className='block text-sm font-medium mb-2'>{translate?.timezoneLabel}</label>
          <Select
            id={"timezone"}
            options={timezones}
            value={selectedTimezone}
            onChange={onSelectTimezone}
            placeholder={translate?.timezonePlaceholder}
            className='text-sm'
            isSearchable={true}
          />
        </div>

        {/* Intervals Display with Handles */}
        <div className='relative min-h-14 bg-amber-600/20 pl-4 pt-4 pr-4 pb-2'>
          <div className={'pl-1 pr-1'}>
            {!data?.intervals || data?.intervals?.length === 0 ? (
              <div className={'italic text-center text-gray-500'}>{translate?.intervalsEmpty}</div>
            ) : (
              <div className='space-y-2'>
                {data?.intervals?.map((interval: { id: string, startTime: string, endTime: string }, index) => (
                  <div key={interval.id}
                       className='relative flex items-center justify-between bg-white p-2 rounded min-h-[40px]'>
                    <span className='text-sm'>{formatTimeRange(interval.startTime, interval.endTime)}</span>

                    <div className='flex items-center'>
                      <MdOutlineMoreHoriz
                        className={'cursor-pointer text-gray-600 hover:text-gray-900'}
                        size={20}
                        onClick={(event) => onClickMenuActions(index, event)}
                      />

                      {selectedIndex === index && (
                        <div className='absolute right-2 top-6 z-50'>
                          <VerticalBar
                            options={menuActions}
                            onClickOutside={onClickOutsideMenuActions}
                          />
                        </div>
                      )}
                    </div>
                    <Handle
                      type='source'
                      className='xyflow-handle'
                      style={{right: '-21px'}}
                      position={Position.Right}
                      id={interval.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* No Match Handle */}
        <div className={'xyflow-node-background-color border-t'}>
          <div className={'flex flex-row'}>
            <div className={'flex flex-row w-full italic text-gray-500 p-2 gap-1 text-sm relative'}>
              <span>{translate?.noMatch}</span>
              <Handle
                type='source'
                className='xyflow-handle'
                style={{right: '-10px', top: '50%', transform: 'translateY(-50%)'}}
                position={Position.Right}
                id={'noMatch'}
              />
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className='flex flex-row justify-end xyflow-node-background-color xyflow-node-border-radius-b-10 p-2'>
          <MdAdd className={'text-primary-600 cursor-pointer'}
                 size={24}
                 onClick={() => onOpenModal(null)}/>
        </div>

        {
          modalOpen && createPortal(
            <ModalTimeInterval
              onCloseModal={onCloseModal}
              onSubmit={onAddInterval}
              onCancel={onCloseModal}
              interval={editingIndex !== null ? data.intervals[editingIndex] : null}
              existingIntervals={data?.intervals || []}
              editingIndex={editingIndex}
            />,
            document.body)
        }

        {/* Input Handle */}
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

export default memo(TimeIntervalNode);
