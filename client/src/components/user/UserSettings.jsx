import { observer } from 'mobx-react';
import { Avatar, List, Card, Button, Input, Typography, Spin, Layout } from 'antd';
import { Modal, Space, Divider, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { updateUser, deleteUser } from '@/services/users';
import { toast } from 'react-toastify';
import PasswordChange from './PasswordChange';
import { UNIVERSITY_CHOICES } from '@/utils/constants';
import { useMutation } from 'react-query';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';
import AttendedArticles from './AttendedArticles';

const UserSettings = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [open, setOpen] = useState(false);
  const [isAttendedModalOpen, setIsAttendedModalOpen] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    canRead: [],
    canWrite: [],
    university: user.university
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const { canWritePurposes, canReadPurposes, isLoading } = useSettingsPermissions();

  const mutation = useMutation(updateUser, {
    onSuccess: data => {
      console.log(data);
      if (data && data.user) {
        localStorage.setItem('CloudRoundsUser', JSON.stringify(data.user));
        const updatedUser = data.user;
        setTempValues({ ...tempValues, updatedUser });
        toast.success('Field updated successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
      }
    },
    onError: error => {
      toast.error(error.message || 'Error updating field. Please try again.', {
        autoClose: 2000,
        pauseOnFocusLoss: false
      });
    }
  });

  useEffect(() => {
    if (!isLoading) {
      setTempValues({ ...tempValues, canRead: user.canReadPurposes, canWrite: user.canWritePurposes });
    }
  }, [isLoading]);

  const handleFieldUpdate = async (field, newValue) => {
    const updatedUser = { _id: user._id, [field]: newValue };
    mutation.mutate(updatedUser);
  };

  const handleEditToggle = field => {
    setEditingField(field);
    setTempValues(prevValues => ({ ...prevValues, [field]: user[field] }));
  };

  const areFieldsValid = () => {
    return ['username', 'firstName', 'lastName', 'email', 'university'].every(field => !!tempValues[field]);
  };

  const handleSaveAll = async field => {
    if (areFieldsValid()) {
      await handleFieldUpdate(field, tempValues[field]);
    } else {
      toast.error(`Invalid or empty fields.`, { autoClose: 2000, pauseOnFocusLoss: false });
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleChange = (field, value) => {
    setTempValues(prevValues => ({ ...prevValues, [field]: value }));
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user._id);

      toast.success('Account deleted successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
    } catch (error) {
      toast.error('Error deleting account. Please try again.', { autoClose: 2000, pauseOnFocusLoss: false });
    }
    setOpenDeleteDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderField = (label, field, choices) => (
    <div style={{ width: editingField === field ? '70%' : '100%', marginBottom: '1rem' }}>
      <Typography.Text>{label}</Typography.Text>
      <div style={{ backgroundColor: '#F9FAFC', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
        {editingField === field ? (
          <>
            {choices ? (
              <Select autoFocus value={tempValues[field]} onChange={value => handleChange(field, value)}>
                {choices.map((choice, index) => (
                  <Select.Option key={index} value={choice.label}>
                    {choice.label}
                  </Select.Option>
                ))}
              </Select>
            ) : editingField === 'password' ? (
              <PasswordChange
                userId={user._id}
                onSuccess={() => {
                  setShowPasswordChange(false);
                  setEditingField(null);
                }}
                onCancel={handleCancel}
              />
            ) : (
              <Input autoFocus value={tempValues[field]} onChange={e => handleChange(field, e.target.value)} />
            )}
            {field !== 'password' && (
              <Space>
                <Button icon={<CheckOutlined />} onClick={() => handleSaveAll(field)} />
                <Button icon={<CloseOutlined />} onClick={handleCancel} />
              </Space>
            )}
          </>
        ) : (
          <div style={{ position: 'relative', padding: '0.6rem', width: '100%' }}>
            {field === 'password' ? (
              <Typography.Text>••••••••</Typography.Text>
            ) : (
              <Typography.Text>{user[field]}</Typography.Text>
            )}
            <Button
              icon={<EditOutlined />}
              type='text'
              onClick={() => handleEditToggle(field)}
              style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading || !user) {
    return <Spin />;
  }

  const initials = user ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : '';

  return (
        <Layout className='p-4 bg-indigo-100	 rounded-lg text-left mb-4'>
                  <div className='p-4 bg-gray-100 rounded-lg text-left mb-4'>
        <div
          className='flex items-center justify-center'
          style={{ paddingInline: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <Typography.Title level={2} className='mt-3'>
            Account Settings
          </Typography.Title>
        </div>
        <div>
          <Space direction='vertical' style={{ width: '100%' }}>
            <div className='mx-auto max-w-[600px] p-6'>
              <Divider className='text-lg font-semibold'>LOGIN INFORMATION</Divider>
              <div className='mt-4'>
                <div className='mb-3'>
                  <Typography.Text>Username</Typography.Text>
                  <Input disabled value={tempValues['username']} style={{ cursor: 'default' }} />
                </div>
                {renderField('Password', 'password')}
              </div>

              <Divider className='text-lg font-semibold'>PROFILE DETAILS</Divider>
              <div className='mt-4'>
                {renderField('First Name', 'firstName')}
                {renderField('Last Name', 'lastName')}
                {renderField('Email', 'email')}
                {renderField('University', 'university', UNIVERSITY_CHOICES.slice(1))}
              </div>

              <Divider>ATTENDED EVENTS</Divider>
              <List>
                {user.attended.length > 0 ? (
                  <div className='p-4 bg-gray-100 rounded-lg text-left mb-4'>
                    <div className='flex items-center space-x-2'>
                      <p className='text-md font-semibold flex-grow'>
                        You have attended {user.attended.length} events.
                      </p>
                      <button
                        className='text-blue-500 hover:text-blue-600 hover:underline font-medium'
                        onClick={() => setIsAttendedModalOpen(true)}>
                        View Details
                      </button>
                    </div>
                    <AttendedArticles isOpen={isAttendedModalOpen} onClose={() => setIsAttendedModalOpen(false)} />
                  </div>
                ) : (
                  <List.Item>No articles attended.</List.Item>
                )}
              </List>

              <div className='p-4 bg-gray-100 rounded-lg text-left mb-4'>
                  
                                <Divider>PERMISSIONS </Divider>

                {user && (
                  <div className='mt-2'>
                    <div className='flex items-center'>
                      <p className='font-medium mr-2'>Calendars:</p>
                      <span className='text-gray-600 text-sm'>
                        {canWritePurposes && canWritePurposes.map(p => p.name).join(', ')}
                      </span>
                    </div>
                    <div className='flex items-center mb-2'>
                      <p className='font-medium mr-2'>Subscribed:</p>
                      <span className='text-gray-600 text-sm'>
                        {canReadPurposes && canReadPurposes.map(p => p.name).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Divider className='text-lg font-semibold text-red-600'>DANGER ZONE</Divider>
              <div className='p-4 bg-red-100 rounded-lg text-left mb-4'>
                <button
                  className='text-red-600 hover:text-red-700 hover:underline font-medium'
                  onClick={handleClickOpen}>
                  Delete Account
                </button>
              </div>

              <Modal
                title='Confirm Deletion'
                open={open}
                onCancel={handleClose}
                footer={[
                  <Button key='back' onClick={handleClose}>
                    Cancel
                  </Button>,
                  <Button
                    key='submit'
                    ghost
                    className='submit-blue-button'
                    type='primary'
                    onClick={handleDeleteAccount}>
                    Confirm
                  </Button>
                ]}>
                Are you sure you want to delete your account? This action cannot be undone.
              </Modal>
            </div>
          </Space>
        </div>
      </div>
    </Layout>
  );
});

export default UserSettings;
