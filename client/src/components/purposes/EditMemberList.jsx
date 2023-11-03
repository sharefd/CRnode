import { useState, useEffect } from 'react';
import { Modal, Button, Transfer, Spin } from 'antd';
import { updatePurpose } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';
import { fetchRequests, createRequest } from '@/services/requests';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose }) => {
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const { data: requests, isLoading: isRequestsLoading, refetch } = useQuery('requests', fetchRequests);

  const [targetKeys, setTargetKeys] = useState(selectedPurpose ? selectedPurpose.canReadMembers : []);

  const handleChange = nextTargetKeys => {
    setTargetKeys(nextTargetKeys);
  };

  // const handleSave = async () => {
  //   const updatedPurpose = {
  //     ...selectedPurpose,
  //     canReadMembers: targetKeys
  //   };
  //   await updatePurpose(selectedPurpose._id.toString(), updatedPurpose);
  //   refetchPurposes();
  //   handleClose();
  // };

  const handleSave = async () => {
    const newMembers = targetKeys.filter(key => !selectedPurpose.canReadMembers.includes(key));
    console.log(newMembers);
    for (const memberId of newMembers) {
      const request = {
        purpose: selectedPurpose.name,
        userId: memberId
      };
      await createRequest(request);
    }

    refetchPurposes();
    handleClose();
  };

  useEffect(() => {
    if (selectedPurpose) {
      setTargetKeys(selectedPurpose.canReadMembers);
    }
  }, [selectedPurpose]);

  const handleModalClose = () => {
    setTargetKeys([]);
    handleClose();
  };

  if (isLoadingUsers) {
    return <Spin />;
  }

  const hasPendingRequest = (userId, purpose) => {
    if (isRequestsLoading) {
      return false;
    }

    return requests.some(
      request => request.user._id === userId && request.purpose === purpose && request.status === 'Pending'
    );
  };

  const dataSource = users.map(user => ({
    key: user._id,
    username: user.username,
    email: user.email,
    disabled: hasPendingRequest(user._id, selectedPurpose && selectedPurpose.name)
  }));

  return (
    <Modal
      title={selectedPurpose && selectedPurpose.name}
      open={open}
      onCancel={handleModalClose}
      footer={[
        <Button key='back' onClick={handleClose}>
          Cancel
        </Button>,
        <Button key='submit' ghost className='submit-blue-button' type='primary' onClick={handleSave}>
          Save
        </Button>
      ]}>
      <Transfer
        dataSource={dataSource}
        titles={['Available', 'Viewers']}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={item => item.username}
        listStyle={{
          width: '45%',
          height: 300
        }}
      />
    </Modal>
  );
};

export default EditMemberList;
