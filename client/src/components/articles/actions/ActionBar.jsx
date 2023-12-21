import { CaretDownFilled, DownCircleFilled, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Drawer, Dropdown, Input, Space, Typography, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { FcCalendar } from 'react-icons/fc';
import { FaCloud } from 'react-icons/fa';
import { EventAvailable, History, Key, ManageSearch, PeopleAlt, Settings } from '@mui/icons-material';

const ActionBar = ({
  selectedPurposes,
  setSelectedPurposes,
  toggleNewArticleModal,
  selectedOrganizers,
  organizerFilter,
  setOrganizerFilter,
  userPurposes,
  emptyPurposes
}) => {
  const now = new Date();

  const App = () => {
    const [open, setOpen] = useState(false);
    const hide = () => {
      setOpen(false);
    };
    const handleOpenChange = newOpen => {
      setOpen(newOpen);
    };

    return (
      <Popover
        content={<a onClick={hide}>Close</a>}
        title={
          <>
            <p>How to create events:</p>
            <br />
            <p>
              Step 1: <PeopleAlt /> Head to the manage tab and create your calendar. Add/invite people to view your
              calendar.
            </p>

            <br />

            <p>
              {' '}
              Step 2: <EventAvailable /> Navigate back to this tab and create events.{' '}
            </p>
            <br />
            <p>
              <Key /> If a calendar is shared with you, the invitation can be accepted in the Requests tab.{' '}
            </p>
            <br />
            <p>
              <History /> All historical events will appear in the Past Events tab.{' '}
            </p>
            <br />
            <p>
              {' '}
              <ManageSearch /> In the future, you will be able to add your calendar to a public catalog, and request
              access to other publically available calendars/rounds.{' '}
            </p>
          </>
        }
        trigger='click'
        open={open}
        onOpenChange={handleOpenChange}
        overlayStyle={{ width: '350px' }} // Set the desired width
      >
        <Button
          type='primary'
          className='custom-help-button'
          style={{ backgroundColor: '#6576e8', border: 'none', display: 'flex', alignItems: 'center' }}>
          <FaCloud style={{ marginRight: '4px' }} />Help
        </Button>
      </Popover>
    );
  };

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [currentTime, setCurrentTime] = useState(formattedTime);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allowedPurposes = userPurposes.map(purpose => purpose.name);

  const filteredPurposes = allowedPurposes.filter(p => p && p.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePurposeToggle = purpose => {
    let newPurposes = [...selectedPurposes];
    if (newPurposes.includes(purpose)) {
      newPurposes = newPurposes.filter(p => p !== purpose);
    } else {
      newPurposes.push(purpose);
    }
    setSelectedPurposes(newPurposes);
  };

  const handleOrganizerToggle = organizer => {
    let newOrganizers = [...organizerFilter];
    if (newOrganizers.includes(organizer)) {
      newOrganizers = newOrganizers.filter(o => o !== organizer);
    } else {
      newOrganizers.push(organizer);
    }
    setOrganizerFilter(newOrganizers);
    console.log(newOrganizers, organizer);
  };

  const selectAllPurposes = () => {
    setSelectedPurposes(filteredPurposes);
  };

  const deselectAllPurposes = () => {
    setSelectedPurposes([]);
  };

  const selectAllOrganizers = () => {
    setOrganizerFilter(selectedOrganizers);
  };

  const deselectAllOrganizers = () => {
    setOrganizerFilter([]);
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'All',
      onClick: () => selectAllPurposes()
    },
    {
      key: '2',
      label: 'None',
      onClick: () => deselectAllPurposes()
    },
    ...userPurposes.map((purpose, index) => ({
      key: index + 3,
      label: purpose.name,
      onClick: () => setSelectedPurposes(purpose.name)
    }))
  ];

  return (
    <div className='relative flex w-full'>
      <Button
        onClick={() => setShowSidebar(!showSidebar)}
        icon={showSidebar ? <LeftOutlined /> : <RightOutlined />}
        className='absolute top-3.5 left-1.5'
        style={{ backgroundColor: '#ffffff'}}

      />

      {/* LEFT SIDEBAR: Article Filters */}
      <Drawer
        title='Filters'
        placement='left'
        closable={true}
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        width={250}
        closeIcon={<RightOutlined />}>
        <Input placeholder='Search...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <Divider>Calendars</Divider>
        <div className='flex items-center mb-2'>
          <Checkbox
            key='all-or-none'
            className='mr-1 custom-checkbox'
            checked={selectedPurposes.length === filteredPurposes.length}
            onChange={() =>
              selectedPurposes.length === filteredPurposes.length
                ? setSelectedPurposes([])
                : setSelectedPurposes(filteredPurposes)
            }
          />
          <Dropdown
            menu={{
              items: dropdownItems,
              triggerSubMenuAction: 'click'
            }}
            className='hover:bg-gray-200 px-[3px] rounded-md'
            trigger={['click']}>
            <Typography.Link>
              <Space>
                <CaretDownFilled className='text-slate-700 text-xs' />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
        <Space direction='vertical' className='w-full'>
          {filteredPurposes.map(purpose => (
            <Checkbox
              disabled={emptyPurposes.includes(purpose)}
              key={purpose}
              checked={selectedPurposes.includes(purpose)}
              onChange={() => handlePurposeToggle(purpose)}>
              {purpose}
            </Checkbox>
          ))}
        </Space>
        <Divider>Organizers</Divider>
        <div className='flex justify-between'>
          <Button size='small' onClick={selectAllOrganizers}>
            Select All
          </Button>
          <Button size='small' onClick={deselectAllOrganizers}>
            Deselect All
          </Button>
        </div>
        <Space direction='vertical' className='w-full mt-4'>
          {selectedOrganizers.map(organizer => (
            <Checkbox
              key={organizer}
              checked={organizerFilter.includes(organizer)}
              onChange={() => handleOrganizerToggle(organizer)}>
              {organizer}
            </Checkbox>
          ))}
        </Space>
      </Drawer>

      {/* Horizontal Bar below Navbar */}
      {/* Display most recent upcoming event details */}

      <Space
        className='flex justify-end items-center w-full px-4 py-3.5 mb-5 purple-light-full'
        style={{ background: '#c7d2fe' }}>
        <App />
        <button className='flex items-center basic-btn purple-light-full' onClick={toggleNewArticleModal}>
          <span style={{ marginRight: '8px' }}>
            <FcCalendar />
          </span>
          <span style={{ fontWeight: 'bold' }}>New Event</span>{' '}
        </button>
        <p className='text-gray-600 text-sm'>{currentTime}</p>
      </Space>
    </div>
  );
};

export default ActionBar;
