import { removeUserFromPurpose } from '@/services/purposes';
import { HourglassOutlined, UserDeleteOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { List, Modal } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CurrentMembersList = ({
  members,
  hasPendingRequest,
  selectedPurpose,
  setTargetKeys,
  deltaTargetKeys,
  setDeltaTargetKeys,
  handleRemovePendingUser
}) => {
  const handleUndoAddmember = userId => {
    setTargetKeys(prevKeys => prevKeys.filter(key => key !== userId));
    setDeltaTargetKeys(prev => prev.filter(key => key !== userId));
  };

  const [hoveredUser, setHoveredUser] = useState(null);

  const handleRemoveUser = async user => {
    Modal.confirm({
      title: 'Are you sure you want to remove this member?',
      content: `This will remove ${user.username} from ${selectedPurpose.name}.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await removeUserFromPurpose(selectedPurpose.name, user._id);
          toast.success(`Success: Removed ${user.username} from ${selectedPurpose.name}.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
          setTargetKeys(prevKeys => prevKeys.filter(key => key !== user._id));
        } catch (error) {
          toast.error(`Error while removing ${user.username} from ${selectedPurpose.name}.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
          console.error('Error removing user:', error);
        }
      },
      onCancel() {}
    });
  };

  const handleClickPending = async item => {
    await handleRemovePendingUser(item);
  };

  const subscribers = members.filter(member => member._id !== selectedPurpose.creator._id);
  const halfLength = Math.ceil(subscribers.length / 2);
  const firstHalfSubscribers = subscribers.slice(0, halfLength);
  const secondHalfSubscribers = subscribers.slice(halfLength);

  const renderListItem = item => {
    const isRegisteredUser = item._id ? true : false;
    return (
      <List.Item
        key={isRegisteredUser ? item._id : item}
        actions={[
          isRegisteredUser ? (
            hasPendingRequest(item._id, selectedPurpose.name) ? (
              hoveredUser && hoveredUser._id === item._id ? (
                <UserDeleteOutlined
                  className='text-lg text-red-300 hover:text-red-500'
                  onMouseOver={() => setHoveredUser(item)}
                  onMouseOut={() => setHoveredUser(null)}
                  onClick={() => handleClickPending(item)}
                />
              ) : (
                <HourglassOutlined
                  className='text-lg text-gray-400'
                  onMouseOver={() => setHoveredUser(item)}
                  onClick={() => handleClickPending(item)}
                />
              )
            ) : deltaTargetKeys.includes(item._id) ? (
              <UserSwitchOutlined
                className='text-lg text-green-500 hover:text-red-600'
                onClick={() => handleUndoAddmember(item._id)}
              />
            ) : (
              <UserDeleteOutlined
                className='text-lg text-red-300 hover:text-red-500'
                onClick={() => handleRemoveUser(item)}
              />
            )
          ) : (
            <HourglassOutlined className='text-lg text-gray-400' />
          )
        ]}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.8rem' }}>
          {isRegisteredUser ? item.username : item}
          <br />
          <i style={{ fontSize: '11px' }}>{isRegisteredUser ? item.email : ''}</i>
        </div>
      </List.Item>
    );
  };

  return (
    <div className='flex flex-row justify-between h-full mx-4'>
      <List className='custom-list w-1/2' dataSource={firstHalfSubscribers} renderItem={renderListItem} />
      <div className='mx-6'></div>
      <List className='custom-list w-1/2' dataSource={secondHalfSubscribers} renderItem={renderListItem} />
    </div>
  );
};

export default CurrentMembersList;
