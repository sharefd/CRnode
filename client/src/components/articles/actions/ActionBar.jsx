import { useEffect, useState } from 'react';
import { Button, Input, Checkbox, Drawer, Space, Divider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ActionBar = ({
  selectedPurposes,
  setSelectedPurposes,
  toggleNewArticleModal,
  canReadPurposes,
  selectedOrganizers,
  organizerFilter,
  setOrganizerFilter
}) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allowedPurposes = canReadPurposes.map(purpose => purpose.name);
  const filteredPurposes = allowedPurposes.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

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

  return (
    <div className='relative flex w-full'>
      <Button
        onClick={() => setShowSidebar(!showSidebar)}
        icon={showSidebar ? <LeftOutlined /> : <RightOutlined />}
        className='absolute top-3'
      />
      <Drawer
        title='Filters'
        placement='left'
        closable={true}
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        width={250}
        closeIcon={<RightOutlined />}>
        <Input placeholder='Search...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <Divider>Purposes</Divider>
        <div className='flex justify-between'>
          <Button size='small' onClick={selectAllPurposes}>
            Select All
          </Button>
          <Button size='small' onClick={deselectAllPurposes}>
            Deselect All
          </Button>
        </div>
        <Space direction='vertical' className='w-full mt-4'>
          {filteredPurposes.map(purpose => (
            <Checkbox
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
      <Space className='flex justify-end items-center w-full px-4 py-3 mb-5 bg-gray-100'>
        <Button type='primary' onClick={toggleNewArticleModal} className='submit-blue-button mr-1'>
          + Create Event
        </Button>
        <p className='text-gray-600 text-sm'>{formattedTime}</p>
      </Space>
    </div>
  );
};

export default ActionBar;
