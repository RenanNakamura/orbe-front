import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Modal from '../../../component/modal/Modal';
import {TimeInterval} from '../../../../../model/flow/WorkflowNode';
import {MdOutlineWarning} from "react-icons/md";

interface ModalTimeIntervalProps {
  onCloseModal: () => void;
  onSubmit: (interval: TimeInterval) => void;
  onCancel: () => void;
  interval: TimeInterval | null;
  existingIntervals: TimeInterval[];
  editingIndex: number | null;
}

const ModalTimeInterval = (props: ModalTimeIntervalProps) => {
  const {t} = useTranslation();
  const {onSubmit, onCancel, interval, existingIntervals, editingIndex, onCloseModal} = props;

  const [startTime, setStartTime] = useState(interval?.startTime || '');
  const [endTime, setEndTime] = useState(interval?.endTime || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (interval) {
      setStartTime(interval.startTime);
      setEndTime(interval.endTime);
    }
  }, [interval]);

  const checkOverlap = (newStartStr: string, newEndStr: string): boolean => {
    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = toMinutes(newStartStr);
    const newEnd = toMinutes(newEndStr);

    const getRanges = (start: number, end: number): [number, number][] => {
      if (start < end) {
        return [[start, end]];
      } else {
        return [[start, 1440], [0, end]];
      }
    };

    const newRanges = getRanges(newStart, newEnd);

    for (let i = 0; i < existingIntervals.length; i++) {
      if (editingIndex !== null && i === editingIndex) {
        continue;
      }

      const existingInterval = existingIntervals[i];
      const existingStart = toMinutes(existingInterval.startTime);
      const existingEnd = toMinutes(existingInterval.endTime);
      const existingRanges = getRanges(existingStart, existingEnd);

      for (const newRange of newRanges) {
        for (const existingRange of existingRanges) {
          if (newRange[0] < existingRange[1] && existingRange[0] < newRange[1]) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const handleSubmit = () => {
    setError('');

    if (!startTime) {
      setError(t('timeIntervalNode.interval.validation.startRequired'));
      return;
    }

    if (!endTime) {
      setError(t('timeIntervalNode.interval.validation.endRequired'));
      return;
    }

    if (startTime === endTime) {
      setError(t('timeIntervalNode.interval.validation.sameTime'));
      return;
    }

    if (checkOverlap(startTime, endTime)) {
      setError(t('timeIntervalNode.interval.validation.overlap'));
      return;
    }

    onSubmit({
      id: interval?.id || '',
      startTime,
      endTime,
    });
  };

  return (
    <Modal
      header={t('timeIntervalNode.modal.title')}
      onCloseModal={onCloseModal}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      btnSubmitLabel={t('add')}
      btnCancelLabel={t('cancel')}
    >
      <div className='flex flex-col gap-4'>
        {/* Start Time */}
        <div className={'mt-2'}>
          <label className='block text-sm font-medium mb-1'>
            {t('timeIntervalNode.interval.startTime')}
          </label>
          <input
            type='time'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600'
          />
        </div>

        {/* End Time */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            {t('timeIntervalNode.interval.endTime')}
          </label>

          <input
            type='time'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-600'
          />

          <p className='text-xs text-gray-500 mt-1'>
            {startTime && endTime && startTime > endTime ? t('timeIntervalNode.interval.crossMidnight') : ''}
          </p>
        </div>

        {/* Error Message */}
        {
          error && (
            <div className={'flex bg-yellow-500 p-2 rounded-md text-white font-bold items-center space-x-2'}>
              <MdOutlineWarning
                className={'cursor-pointer text-white'}
                data-tooltip-id='alert'
                size={24}
              />
              <span className='text-sm'>{error}</span>
            </div>
          )
        }
      </div>
    </Modal>
  );
};

export default ModalTimeInterval;
