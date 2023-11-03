import { observer } from 'mobx-react';
import { Avatar, List, Card, Button, Progress, Input, Grid, Typography } from 'antd';
import { Modal, Dropdown, Menu, Popconfirm, Badge, Alert, Space, Divider, Tooltip, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { updateUser, deleteUser } from '@/services/users';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/dates';
import PasswordChange from './PasswordChange';
import { UNIVERSITY_CHOICES } from '@/utils/constants';
import { useMutation } from 'react-query';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';

const UserSettings = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [open, setOpen] = useState(false);
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

  const { purposes, canWritePurposes, canReadPurposes, isLoading } = useSettingsPermissions(user);

  const mutation = useMutation(updateUser, {
    onSuccess: data => {
      localStorage.setItem('CloudRoundsUser', JSON.stringify(data.user));

      setTempValues(data.user);
      toast.success('Field updated successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
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
    <div style={{ width: editingField === field ? '70%' : '95%', marginBottom: '1rem' }}>
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
    return <Progress />;
  }

  const initials = user ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : '';

  return (
    <Card style={{ maxWidth: '600px', margin: '0 auto', marginTop: '1rem', marginBottom: '2rem' }}>
      <div className='flex justify-between items-center bg-bluebrand text-white' style={{ padding: '0.8rem 1rem' }}>
        <Typography.Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 300 }}>
          Account Settings
        </Typography.Title>
        <Avatar className='bg-white text-bluebrand align-middle' size={42} gap={8}>
          {initials}
        </Avatar>
      </div>
      <Space direction='vertical' style={{ width: '100%' }}>
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <Divider>LOGIN INFORMATION</Divider>
          <Space direction='vertical' style={{ width: '100%' }}>
            {renderField('Username', 'username')}
            {renderField('Password', 'password')}
          </Space>

          <Divider>PROFILE DETAILS</Divider>
          <Space direction='vertical' style={{ width: '100%' }}>
            {renderField('First Name', 'firstName')}
            {renderField('Last Name', 'lastName')}
            {renderField('Email', 'email')}
            {renderField('University', 'university', UNIVERSITY_CHOICES.slice(1))}
          </Space>

          <Divider>ATTENDED ARTICLES</Divider>
          <List>
            {user.attended.length > 0 ? (
              user.attended.map((article, index) => (
                <List.Item key={index}>
                  {article.title}
                  <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                    ({formatDate(article.date)})
                  </span>
                </List.Item>
              ))
            ) : (
              <List.Item>No articles attended.</List.Item>
            )}
          </List>

          <Divider>PERMISSIONS</Divider>
          {user && (
            <List>
              <List.Item>
                Can View:
                <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                  {canReadPurposes && canReadPurposes.map(p => p.name).join(', ')}
                </span>
              </List.Item>
              <List.Item>
                Can Create:
                <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                  {canWritePurposes && canWritePurposes.map(p => p.name).join(', ')}
                </span>
              </List.Item>
            </List>
          )}

          <Divider>DANGER ZONE</Divider>
          <Button type='link' onClick={handleClickOpen}>
            Delete Account
          </Button>
          <Modal
            title='Confirm Deletion'
            open={open}
            onCancel={handleClose}
            footer={[
              <Button key='back' onClick={handleClose}>
                Cancel
              </Button>,
              <Button key='submit' ghost className='submit-blue-button' type='primary' onClick={handleDeleteAccount}>
                Confirm
              </Button>
            ]}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Modal>
        </div>
      </Space>
    </Card>
  );
});

export default UserSettings;
