import { useState } from 'react';
import { Modal, Input, Button, Spin } from 'antd';
import { createPurpose } from '@/services/purposes';
import { useMutation } from 'react-query';

const NewPurpose = ({ open, handleClose, userId, setPurposes }) => {
  const [loading, setLoading] = useState(false);
  const [newPurpose, setNewPurpose] = useState({
    name: '',
    description: '',
    canReadMembers: [userId],
    canWriteMembers: [userId],
    creator: userId
  });

  const createPurposeMutation = useMutation(createPurpose);

  const handleSave = async () => {
    try {
      const createdPurpose = await createPurposeMutation.mutateAsync(newPurpose);
      setPurposes(prevPurposes => [...prevPurposes, createdPurpose]);
      handleClose();
    } catch (error) {
      console.error('Error while saving:', error);
    }
  };

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
            placeholder='Name/Acronym (e.g. UofT OMR)'
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
          <Input
            placeholder='Description (e.g. Weekly Divisional Cardiology Rounds)'
            style={{ marginTop: '10px' }}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
        </>
      )}
    </Modal>
  );
};

export default NewPurpose;
