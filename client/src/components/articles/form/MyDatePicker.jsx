import { useEffect, useState } from 'react';
import DatePicker from 'tailwind-datepicker-react';
import { BiSolidTime } from 'react-icons/bi';

const options = {
  autoHide: true,
  todayBtn: true,
  clearBtn: true,
  clearBtnText: 'Clear',
  maxDate: new Date('2050-01-01'),
  minDate: new Date('2023-01-01'),
  theme: {
    todayBtn: 'bg-black text-white',
    clearBtn: '',
    icons: '',
    text: '',
    disabledText: 'text-gray-300',
    input: '',
    inputIcon: '',
    selected: ''
  },
  icons: {
    prev: () => <span>{'<'}</span>,
    next: () => <span>{'>'}</span>
  },
  datepickerClassNames: 'py-0 mt-0',
  defaultDate: new Date(),
  language: 'en',
  disabledDates: [],
  weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  inputNameProp: 'date',
  inputIdProp: 'date',
  inputPlaceholderProp: 'Select Date',
  inputDateFormatProp: {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
};

const MyDatePicker = ({ article, setDate, setStartTime, setEndTime }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState({ hour: '8', minute: '00', ampm: 'am' });
  const [selectedEndTime, setSelectedEndTime] = useState({ hour: '9', minute: '00', ampm: 'am' });
  const [isValidTime, setIsValidTime] = useState(true);

  useEffect(() => {
    if (article) {
      options.defaultDate = new Date(article.date);
      const duration = article.duration.split(' - ');
      const startTime = duration[0].split(' ');
      const endTime = duration[1].split(' ');
      setSelectedStartTime({
        hour: startTime[0].split(':')[0],
        minute: startTime[0].split(':')[1],
        ampm: startTime[1]
      });
      setSelectedEndTime({ hour: endTime[0].split(':')[0], minute: endTime[0].split(':')[1], ampm: endTime[1] });
    }
  }, []);

  const handleChange = selectedDate => {
    setSelectedDate(selectedDate);
    setDate(selectedDate);
  };

  const handleStartTimeChange = (field, value) => {
    const updatedStartTime = { ...selectedStartTime, [field]: value };
    setSelectedStartTime(updatedStartTime);
    setStartTime(`${updatedStartTime.hour}:${updatedStartTime.minute} ${updatedStartTime.ampm}`);

    validateTime(updatedStartTime, selectedEndTime);
  };

  const handleEndTimeChange = (field, value) => {
    const updatedEndTime = { ...selectedEndTime, [field]: value };
    setSelectedEndTime(updatedEndTime);
    setEndTime(`${updatedEndTime.hour}:${updatedEndTime.minute} ${updatedEndTime.ampm}`);

    validateTime(selectedStartTime, updatedEndTime);
  };

  const handleClose = state => {
    setShow(state);
  };

  const hours = [];
  for (let i = 1; i <= 12; i++) {
    hours.push(
      <option key={`hours-${i}`} value={i}>
        {i}
      </option>
    );
  }

  const minutes = [];
  for (let i = 0; i < 60; i += 5) {
    minutes.push(
      <option key={`minutes-${i}`} value={i}>
        {i < 10 ? `0${i}` : i}
      </option>
    );
  }

  const hourStyle = value => ({
    width: parseInt(value, 10) < 10 ? '12px' : '18px'
  });

  const separatorStyle = value => ({
    marginBottom: 2
  });

  const validateTime = (startTime, endTime) => {
    const startHour = parseInt(startTime.hour, 10);
    const startMinutes = parseInt(startTime.minute, 10);
    const endHour = parseInt(endTime.hour, 10);
    const endMinutes = parseInt(endTime.minute, 10);

    const isValid =
      !(startHour === endHour && startMinutes === endMinutes) &&
      !(startHour > endHour) &&
      !(startHour === endHour && startMinutes > endMinutes);

    setIsValidTime(isValid);

    return isValid;
  };

  return (
    <div className='flex justify-center items-center text-sm'>
      <div className='relative w-48 flex-shrink-0 group'>
        <label className={`block mb-1 text-xs font-small text-gray-700 group-focus-within:text-bluebrand`}>Date</label>
        <DatePicker show={show} setShow={setShow} options={options} onChange={handleChange} />
      </div>

      {/* Time Pickers */}
      <div className='group'>
        <label className={`block ml-8 mb-1 text-xs font-small text-gray-700 group-focus-within:text-bluebrand`}>
          Time
        </label>

        <div
          className={`flex items-center border ${
            isValidTime ? 'border-gray-300 group-focus-within:border-bluebrand' : 'border-red-500'
          } bg-gray-50 rounded-lg w-58 px-2 py-2 ml-8 flex-shrink-0 `}>
          {/* START TIME */}
          <div className='flex items-center'>
            <BiSolidTime style={{ marginRight: '4px' }} />
            {selectedStartTime.hour < 10 && <span style={{ opacity: 0, width: '6px' }}>1</span>}
            <select
              name='hours'
              style={hourStyle(selectedStartTime.hour)}
              className={`bg-transparent text-md appearance-none outline-none mx-1`}
              value={selectedStartTime.hour}
              onChange={e => handleStartTimeChange('hour', e.target.value)}>
              {hours}
            </select>
            <span className='text-md mr-1' style={separatorStyle(selectedStartTime.hour)}>
              :
            </span>
            <select
              name='minutes'
              className='bg-transparent text-md appearance-none outline-none mx-0.5'
              value={selectedStartTime.minute}
              onChange={e => handleStartTimeChange('minute', e.target.value)}>
              {minutes}
            </select>
            <select
              name='ampm'
              className='bg-transparent text-md appearance-none outline-none mx-0.5'
              value={selectedStartTime.ampm}
              onChange={e => handleStartTimeChange('ampm', e.target.value)}>
              <option value='am'>AM</option>
              <option value='pm'>PM</option>
            </select>
          </div>

          {/* TO */}
          <span className='text-gray-500 ml-2 mr-2'>to</span>
          {/* END TIME */}
          <div className='flex items-center'>
            {selectedEndTime.hour < 10 && <span style={{ opacity: 0, width: '6px' }}>0</span>}
            <select
              style={hourStyle(selectedEndTime.hour)}
              name='hours'
              className='bg-transparent text-md appearance-none outline-none mr-1'
              value={selectedEndTime.hour}
              onChange={e => handleEndTimeChange('hour', e.target.value)}>
              {hours}
            </select>
            <span className='text-md mr-1' style={{ marginBottom: 2 }}>
              :
            </span>
            <select
              name='minutes'
              className='bg-transparent text-md appearance-none outline-none mx-0.5'
              value={selectedEndTime.minute}
              onChange={e => handleEndTimeChange('minute', e.target.value)}>
              {minutes}
            </select>
            <select
              name='ampm'
              className='bg-transparent text-md appearance-none outline-none mx-0.5'
              value={selectedEndTime.ampm}
              onChange={e => handleEndTimeChange('ampm', e.target.value)}>
              <option value='am'>AM</option>
              <option value='pm'>PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDatePicker;
