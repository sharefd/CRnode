import { List } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const UserList = ({ users, setTargetKeys, setDeltaTargetKeys }) => {
  const handleAddUser = userId => {
    setTargetKeys(prevKeys => [...prevKeys, userId]);
    setDeltaTargetKeys(prev => [...prev, userId]);
  };

  return (
    <List
      className='custom-list'
      dataSource={users}
      renderItem={user => (
        <List.Item
          key={user._id}
          actions={[
            <UserAddOutlined
              className='text-xl text-blue-300 hover:text-blue-500'
              onClick={() => handleAddUser(user._id)}
            />
          ]}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {user.username}
            <br />
            <i style={{ fontSize: 'smaller' }}>{user.email}</i>
          </div>
        </List.Item>
      )}
    />
  );
};

export default UserList;
