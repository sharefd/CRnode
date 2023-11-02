import { useState, useEffect } from 'react';
import { Modal, Button, Transfer, Spin } from 'antd';
import { updatePurpose } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose }) => {
  const { data, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const [targetKeys, setTargetKeys] = useState(selectedPurpose ? selectedPurpose.canReadMembers : []);

  const handleChange = nextTargetKeys => {
    setTargetKeys(nextTargetKeys);
  };

  const handleSave = async () => {
    const updatedPurpose = {
      ...selectedPurpose,
      canReadMembers: targetKeys
    };
    await updatePurpose(selectedPurpose._id.toString(), updatedPurpose);
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

  const dataSource = data.map(user => ({
    key: user._id,
    username: user.username,
    email: user.email
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
