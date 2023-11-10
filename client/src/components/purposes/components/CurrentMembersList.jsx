import { List, Modal } from 'antd';
import { HourglassOutlined, UserDeleteOutlined, UserSwitchOutlined, CloseOutlined } from '@ant-design/icons';
import { removeUserFromPurpose } from '@/services/purposes';
import { toast } from 'react-toastify';

const CurrentMembersList = ({
  members,
  hasPendingRequest,
  selectedPurpose,
  setTargetKeys,
  deltaTargetKeys,
  setDeltaTargetKeys
}) => {
  const handleUndoAddmember = userId => {
    setTargetKeys(prevKeys => prevKeys.filter(key => key !== userId));
    setDeltaTargetKeys(prev => prev.filter(key => key !== userId));
  };

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

  return (
    <List
      className='custom-list'
      dataSource={members}
      renderItem={item => {
        const isRegisteredUser = item._id ? true : false;
        return (
          <List.Item
            key={isRegisteredUser ? item._id : item}
            actions={[
              isRegisteredUser ? (
                hasPendingRequest(item._id, selectedPurpose.name) ? (
                  <HourglassOutlined className='text-lg text-gray-400' />
                ) : deltaTargetKeys.includes(item._id) ? (
                  <UserSwitchOutlined
                    className='text-xl text-green-500 hover:text-red-600'
                    onClick={() => handleUndoAddmember(item._id)}
                  />
                ) : (
                  <UserDeleteOutlined
                    className='text-xl text-red-300 hover:text-red-500'
                    onClick={() => handleRemoveUser(item)}
                  />
                )
              ) : (
                <HourglassOutlined className='text-lg text-gray-400' />
              )
            ]}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {isRegisteredUser ? item.username : item}
              <br />
              <i style={{ fontSize: 'smaller' }}>{isRegisteredUser ? item.email : ''}</i>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default CurrentMembersList;
