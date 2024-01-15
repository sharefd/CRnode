import { AppleOutlined, GoogleOutlined, CalendarOutlined } from '@ant-design/icons';
import { createEvent } from 'ics';
import { extractTimesFromDuration } from '@/utils/dates';
import dayjs from 'dayjs';
import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';



const ExportButton = ({ article, text, fontSize }) => {
  const [visible, setVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    handleExport(article, key);
    setVisible(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="ical" icon={<AppleOutlined />}>
        iCal
      </Menu.Item>
      <Menu.Item key="gmail" icon={<GoogleOutlined />}>
        GCal
      </Menu.Item>
    </Menu>
  );
    
  const createIcsFile = (event) => {
    const {
      title,
      date,
      duration,
      location,
      additional_details,
      speaker,
      organizer,
      meeting_id,
      passcode,
      event_link,
    } = event;
    const [startTime, endTime] = extractTimesFromDuration(duration);

    const startDate = dayjs(date).hour(startTime.hour()).minute(startTime.minute());
    const endDate = dayjs(date).hour(endTime.hour()).minute(endTime.minute());

    let description = '';

    if (additional_details) {
      description += `Details: ${additional_details}\n`;
    }

    if (speaker) {
      description += `Speaker: ${speaker}\n`;
    }

    if (organizer) {
      description += `Organized by: ${organizer.firstName} ${organizer.lastName}\n`;
    }

    if (meeting_id) {
      description += `Meeting ID: ${meeting_id}\n`;
    }

    if (passcode) {
      description += `Passcode: ${passcode}\n`;
    }

    const eventObject = {
      title: title || 'Untitled Event',
      start: [
        startDate.year(),
        startDate.month() + 1,
        startDate.date(),
        startDate.hour(),
        startDate.minute(),
      ],
      end: [endDate.year(), endDate.month() + 1, endDate.date(), endDate.hour(), endDate.minute()],
      location,
    };

    // Include url property only if event_link is not empty
    if (event_link) {
      eventObject.url = isValidUrl(event_link) ? event_link : '';
    }

    if (description) {
      eventObject.description = description;
    }

    createEvent(eventObject, (error, value) => {
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([value], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title.replace(/[^a-zA-Z ]/g, '') || 'untitled'}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  // URL validation function
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

const createGmailLink = (event) => {
  const {
    title,
    date,
    duration,
    location,
    additional_details,
    speaker,
    organizer,
    meeting_id,
    passcode,
    event_link,
  } = event;
  const [startTime, endTime] = extractTimesFromDuration(duration);

  const startDate = dayjs(date).hour(startTime.hour()).minute(startTime.minute());
  const endDate = dayjs(date).hour(endTime.hour()).minute(endTime.minute());

  let description = '';
    
    if (event_link) {
    description += `${event_link}\n`;
  }
    

  if (additional_details) {
    description += `Details: ${additional_details}\n`;
  }

  if (speaker) {
    description += `Speaker: ${speaker}\n`;
  }

  if (organizer) {
    description += `Organized by: ${organizer.firstName} ${organizer.lastName}\n`;
  }

  if (meeting_id) {
    description += `Meeting ID: ${meeting_id}\n`;
  }

  if (passcode) {
    description += `Passcode: ${passcode}\n`;
  }

    
    let gmailLink = `https://mail.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title || 'Untitled Event'
  )}&dates=${startDate.format('YYYYMMDDTHHmmss')}%2F${endDate.format('YYYYMMDDTHHmmss')}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

// Include url property only if event_link is not empty and is a valid URL
  if (event_link && isValidUrl(event_link)) {
    gmailLink += `&url=${encodeURIComponent(event_link)}`;
  }

  return gmailLink;
};


  const openGmailLink = (event) => {
    const gmailLink = createGmailLink(event);
    window.open(gmailLink, '_blank');
  };

  const handleExport = (event, type) => {
    if (type === 'ical') {
      createIcsFile(event);
    } else if (type === 'gmail') {
      openGmailLink(event);
    }
  };

  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <div className='flex items-center basic-btn red-full px-2 py-[3px] hover:bg-purple-100 rounded-md'>
        <CalendarOutlined className='text-md text-[#f47d7f]' />
        <p className='ml-1 text-[#f47d7f]' style={{ fontWeight: 700, fontFamily: 'sans-serif', fontSize: '12px' }}>
          {text ? text : 'Export'}
        </p>
      </div>
    </Dropdown>
  );
};


export default ExportButton;
