import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './TimeRangePicker.css';

const { Text } = Typography;

const TimeRangePicker = ({ value, onChange, isNewArticleModalOpen }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState('Start');
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  useEffect(() => {
    return () => {
      setSelectedStartTime(null);
      setSelectedEndTime(null);
      setSelectionType('Start');
    };
  }, [onChange, isNewArticleModalOpen]);

  const showModal = () => {
    if (selectedEndTime) {
      setSelectionType('Start');
    } else if (selectedStartTime) {
      setSelectionType('End');
    }

    if (value[0]) {
      setSelectedStartTime(value[0]);
    }

    if (value[1]) {
      setSelectedEndTime(value[1]);
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isStartSelected = time => {
    if (selectedStartTime) {
      const isSameStart = selectedStartTime.format('h:mm A') === time.format('h:mm A');
      if (isSameStart) return true;
    }
  };

  const isEndSelected = time => {
    if (selectedEndTime) {
      const isSameEnd = selectedEndTime.format('h:mm A') === time.format('h:mm A');
      if (isSameEnd) return true;
    }
  };

  const handleStartTimeClick = time => {
    if (isStartSelected(time)) {
      setSelectedStartTime(null);
      setSelectionType('Start');
    } else if (isEndSelected(time)) {
      setSelectedEndTime(null);
      setSelectionType('End');
    } else {
      if (selectedEndTime && time.isAfter(selectedEndTime)) {
        message.error('Start time cannot be at or after the end time (' + `${selectedEndTime.format('h:mm A')})`);
        return;
      }
      setSelectedStartTime(time);
      if (!selectedEndTime) {
        setSelectionType('End');
      } else {
        onChange([time, selectedEndTime]);
        setIsModalVisible(false);
      }
    }
  };

  const handleEndTimeClick = time => {
    if (isStartSelected(time)) {
      setSelectedStartTime(null);
      setSelectionType('Start');
      return;
    }
    if (isEndSelected(time)) {
      setSelectedEndTime(null);
      setSelectionType('End');

      return;
    } else {
      if (selectedStartTime && time.isBefore(selectedStartTime)) {
        message.error('End time cannot be at or before the start time (' + `${selectedStartTime.format('h:mm A')})`);
        return;
      }
      setSelectedEndTime(time);
      onChange([selectedStartTime, time]);
      setIsModalVisible(false);
    }
  };

  const handleTimeSlotClick = time => {
    if (selectionType === 'Start') {
      handleStartTimeClick(time);
    } else {
      handleEndTimeClick(time);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push(dayjs().hour(hour).minute(minute).second(0));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const renderTimeSlots = () => (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
        {timeSlots.map((time, index) => (
          <button
            key={index}
            className={`grid-btn time-slot ${
              isStartSelected(time) ? 'selected' : isEndSelected(time) ? 'end-selected' : ''
            }`}
            onClick={() => handleTimeSlotClick(time)}
            style={{ textAlign: 'center' }}>
            {time.format('h:mm A')}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <>
      <Text onClick={showModal} className={`time-btn ${!value[0] ? 'time-gray' : ''}`}>
        <ClockCircleOutlined className='mr-[5px] text-xs' />
        {value[0] ? value[0].format('h:mm A') : 'Start'} - {value[1] ? value[1].format('h:mm A') : 'End'}
      </Text>

      <Modal
        title={`Select ${selectedStartTime && selectedEndTime ? '' : selectionType} Time`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}>
        {renderTimeSlots()}
      </Modal>
    </>
  );
};

export default TimeRangePicker;
