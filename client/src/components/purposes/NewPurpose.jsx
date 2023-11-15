import { useState } from 'react';
import { Modal, Input, Button, Spin } from 'antd';
import { createPurpose } from '@/services/purposes';
import { useMutation } from 'react-query';
import userStore from '@/stores/userStore';

const NewPurpose = ({ open, handleClose, userId, setPurposes, refetchPurposes }) => {
  const [loading, setLoading] = useState(false);
  const [newPurpose, setNewPurpose] = useState({
    name: '',
    description: '',
    canReadMembers: [userId],
    canWriteMembers: [userId],
    creator: userId
  });

  const createPurposeMutation = useMutation(createPurpose, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async data => {
      await refetchPurposes();
      setPurposes(prevPurposes => {
        const newPurposes = [...prevPurposes, data];
        userStore.setPurposes(newPurposes);
        return newPurposes;
      });
      setLoading(false);

      handleClose();
    },
    onError: () => {
      setLoading(false);
    }
  });

  const handleSave = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await createPurposeMutation.mutateAsync(newPurpose);
      } catch (error) {
        console.error('Error while saving:', error);
        setLoading(false);
      }
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
        <Button
          key='submit'
          ghost
          type='primary'
          loading={loading}
          onClick={handleSave}
          className='new-calendar-button'>
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
