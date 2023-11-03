import { useState } from 'react';
import { Modal, Input, Button, Select, Spin } from 'antd';
import { createPurpose } from '@/services/purposes';
import { createBulkRequests } from '@/services/requests';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';

const { Option } = Select;
const { TextArea } = Input;

const NewPurpose = ({ open, handleClose, refetchPurposes, user }) => {
  const [loading, setLoading] = useState(false);

  const [newPurpose, setNewPurpose] = useState({ name: '', description: '', canReadMembers: [], canWriteMembers: [] });

  const { data, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const handleAddMember = value => {
    setNewPurpose(prevState => ({
      ...prevState,
      canReadMembers: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const createdPurpose = await createPurpose(user._id, {
        name: newPurpose.name,
        description: newPurpose.description,
        canReadMembers: [],
        canWriteMembers: []
      });

      if (createdPurpose && createdPurpose._id) {
        await createBulkRequests(newPurpose.canReadMembers, createdPurpose.name);
      }

      await refetchPurposes();
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error('Error while saving:', error);
    }
  };

  if (isLoadingUsers) {
    return <Spin />;
  }

  const users = data.filter(u => u._id !== user._id);

  return (
    <Modal
      title='Create New Calendar'
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key='back' onClick={handleClose}>
          Cancel
        </Button>,
        <Button key='submit' ghost type='primary' onClick={handleSave} className='new-calendar-button'>
          Save
        </Button>
      ]}>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Input
            placeholder='Acronym (e.g. UOFTAMR)'
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
          <Input
            placeholder='Description (e.g. UofT Aerospace Rounds)'
            style={{ marginTop: '10px' }}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
          <Select
            mode='multiple'
            style={{ width: '100%', marginTop: '10px' }}
            placeholder='Viewer Permissions'
            onChange={handleAddMember}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
            {users.map(user => (
              <Option key={user._id} value={user._id}>
                {`${user.username} (${user.email})`}
              </Option>
            ))}
          </Select>
        </>
      )}
    </Modal>
  );
};

export default NewPurpose;
