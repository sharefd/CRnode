import { LockOutlined } from '@ant-design/icons';
import { Input, Button, Space } from 'antd';
import { useState } from 'react';
import { changePassword } from '../../services/users';
import { toast } from 'react-toastify';

const PasswordChange = ({ userId, onSuccess, onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    try {
      await changePassword(userId, currentPassword, newPassword);
      onSuccess();
      toast.success('Password updated successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
    } catch (error) {
      toast.error(`Error updating password. ${error.data} Please try again.`, {
        autoClose: 2000,
        pauseOnFocusLoss: false
      });
    }
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Input.Password
        autoFocus
        placeholder='Current Password'
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        prefix={<LockOutlined />}
      />
      <Input.Password
        placeholder='New Password'
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        prefix={<LockOutlined />}
      />
      <Input.Password
        placeholder='Confirm New Password'
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        prefix={<LockOutlined />}
      />
      <div className='text-center my-2'>
        <Space>
          <Button type='primary' ghost className='submit-blue-button' onClick={handleChangePassword}>
            Submit
          </Button>
          <Button type='default' onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </div>
    </Space>
  );
};
export default PasswordChange;
