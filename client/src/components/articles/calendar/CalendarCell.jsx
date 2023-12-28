import purposeIcons from '@/components/ui/PurposeIcons';
import { formatDate } from '@/utils/dates';
import {
  ClockCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  LinkOutlined,
  LockOutlined,
  RightOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Badge, Button, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import ExportToIcalButton from './ExportToIcalButton';

const CalendarCell = ({ day, month, year, events, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const isToday = day === currentDay && month === currentMonth && year === currentYear;

  const stopPropagation = e => {
    e.stopPropagation();
  };

  const handleCellClick = () => {
    setSelected(day);
    if (events.length === 0) return;
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
    setCurrentEventIndex(0);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex(prevIndex => Math.min(prevIndex + 1, events.length - 1));
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const article = events[currentEventIndex] || {};
  const isInPersonMeeting = article.meetingType === 'In-Person';
  const isHybridMeeting = article.meetingType === 'Hybrid';

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = text => {
    navigator.clipboard.writeText(text).then(
      function () {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 600);
      },
      function (err) {
        console.error('Failed to copy link to clipboard', err);
      }
    );
  };

  return (
    <div key={`${day}-${month}-${year}`} onClick={handleCellClick} id='calendar-cell'>
      <div
        className={`relative w-8 h-8 flex rounded-md items-center justify-center ${
          isToday ? 'border border-[#5161ce]' : ''
        }`}>
        <Badge
            
          count={events.length}
          className='absolute calendar-badge'
          style={{ fontSize: '10px', border: 'none', left: day >= 10 ? 16 : 12 }}
        />
        <Typography.Text
          strong
          style={{
            color: isToday ? '#000' : 'inherit'
          }}>
          {day}
        </Typography.Text>
      </div>

      <Modal open={open} onCancel={handleClose} footer={null} width={420}>
        <div onClick={stopPropagation}>
          <Typography.Title level={4} className='mb-5'>
            {article.title}
          </Typography.Title>

          <div className='flex justify-start items-center mb-5 purpose-badge ml-0 mr-auto'>
            {purposeIcons[article.purpose && article.purpose.name] || purposeIcons.DEFAULT}
            <p className='ml-2' style={{ fontSize: '13px' }}>
              {article.purpose && article.purpose.name}
            </p>
          </div>

          <div className='flex items-center mb-5 justify-between'>
            <div className='flex items-center'>
              <ClockCircleOutlined className='mr-2' />
              {formatDate(article.date)} @ {article.duration}
            </div>
            <ExportToIcalButton article={article} />
          </div>

          <div className='flex items-center mb-5'>
            {isInPersonMeeting ? (
              <div className='flex items-center mb-2'>
                <EnvironmentOutlined className='mr-2' />
                <span>{article.location}</span>
              </div>
            ) : (
              <div className={`flex items-center space-x-4 mb-0`}>
                <LinkOutlined />
                <Button
                  onClick={e => {
                    handleCopyToClipboard(article.event_link);
                    stopPropagation(e);
                  }}>
                  <div className='flex items-center'>
                    <CopyOutlined />
                    <span className='ml-2'>Copy Link</span>
                  </div>
                </Button>
                <Button
                  onClick={e => {
                    window.open(article.event_link, '_blank');
                    stopPropagation(e);
                  }}
                  className='border'>
                  <div className='flex items-center'>
                    <UsergroupAddOutlined />
                    <span className='ml-2'>Join Meeting</span>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {!isInPersonMeeting && (
            <div className='flex items-center mb-5'>
              <LockOutlined className='mr-2' />
              <span>
                Meeting ID: {article.meeting_id || 'None'} | Passcode: {article.passcode || 'None'}
              </span>

              {isHybridMeeting && (
                <div className='flex items-center mb-2'>
                  <EnvironmentOutlined className='mr-2' />
                  <span>{article.location}</span>
                </div>
              )}
            </div>
          )}

          <div className='flex justify-between items-center'>
            <Button
              icon={<LeftOutlined />}
              onClick={e => {
                handlePrevEvent();
                stopPropagation(e);
              }}
              disabled={currentEventIndex === 0}
            />
            {events.length > 1 && (
              <Typography.Text strong>{`${currentEventIndex + 1}/${events.length}`}</Typography.Text>
            )}
            <Button
              icon={<RightOutlined />}
              onClick={e => {
                handleNextEvent();
                stopPropagation(e);
              }}
              disabled={currentEventIndex === events.length - 1}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarCell;