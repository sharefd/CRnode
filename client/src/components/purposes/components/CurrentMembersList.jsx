import { List } from 'antd';
import { HourglassOutlined, UserDeleteOutlined } from '@ant-design/icons';

const CurrentMembersList = ({ members, handleRemoveUser, hasPendingRequest, selectedPurpose }) => {
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
