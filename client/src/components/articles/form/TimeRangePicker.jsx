import { useState } from 'react';
import { Modal, Typography, Button, message } from 'antd';
import './TimeRangePicker.css';
import dayjs from 'dayjs';
const { Text } = Typography;

const TimeRangePicker = ({ value, onChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('start');

  const showModal = selectionType => {
    setCurrentSelection(selectionType);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isSelected = time => {
    const [start, end] = value;
    return (start && time.isSame(start)) || (end && time.isSame(end));
  };

  const handleTimeSlotClick = time => {
    if (currentSelection === 'start') {
      if (value[1] && (time.isAfter(value[1]) || time.isSame(value[1]))) {
        message.error('Start time cannot be the same as or after the end time (' + `${value[1].format('h:mm A')})`);
        return;
      }
      onChange([time, value[1]]);
    } else {
      if (value[0] && (time.isBefore(value[0]) || time.isSame(value[0]))) {
        message.error('End time cannot be the same as or before the start time (' + `${value[0].format('h:mm A')})`);
        return;
      }
      onChange([value[0], time]);
    }
    setIsModalVisible(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push(dayjs().hour(hour).minute(minute).second(0));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const renderTimeSlots = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
      {timeSlots.map((time, index) => (
        <Button
          key={index}
          className={`time-slot ${isSelected(time) ? 'selected' : ''}`}
          onClick={() => handleTimeSlotClick(time)}
          style={{ textAlign: 'center' }}>
          {time.format('h:mm A')}
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <Text onClick={() => showModal('start')} className='time-btn'>
        {value[0] ? value[0].format('h:mm A') : 'Start Time'}
      </Text>
      <span> - </span>
      <Text onClick={() => showModal('end')} className='time-btn'>
        {value[1] ? value[1].format('h:mm A') : 'End Time'}
      </Text>

      <Modal title='Select Time' open={isModalVisible} onCancel={handleCancel} footer={null} width={400}>
        {renderTimeSlots()}
      </Modal>
    </>
  );
};

export default TimeRangePicker;
