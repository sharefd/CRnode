import { useState, useEffect } from 'react';
import { Modal, Button, List, Input, Spin, Pagination } from 'antd';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';
import { fetchRequests, createRequest } from '@/services/requests';
import { removeUserFromPurpose } from '@/services/purposes';
import { toast } from 'react-toastify';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose }) => {
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);
  const { data: requests, isLoading: isRequestsLoading } = useQuery('requests', fetchRequests);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [targetKeys, setTargetKeys] = useState(selectedPurpose ? selectedPurpose.canReadMembers : []);
  const [searchValue, setSearchValue] = useState('');

  const handleAddUser = userId => {
    setTargetKeys(prevKeys => [...prevKeys, userId]);
  };

  const handleRemoveUser = async user => {
    try {
      await removeUserFromPurpose(selectedPurpose.name, user._id);
      toast.success(`Success: Removed ${user.username} from ${selectedPurpose.name}.`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
      setTargetKeys(prevKeys => prevKeys.filter(key => key !== user._id));
    } catch (error) {
      toast.error(`Error while removing ${user.username} from ${selectedPurpose.name}.`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });

      console.error('Error removing user:', error);
    }
  };

  const handleSave = async () => {
    const newMembers = targetKeys.filter(key => !selectedPurpose.canReadMembers.includes(key));
    for (const memberId of newMembers) {
      const request = {
        purpose: selectedPurpose.name,
        userId: memberId
      };
      await createRequest(request);
    }
    refetchPurposes();
    handleModalClose();
  };

  useEffect(() => {
    if (selectedPurpose) {
      setTargetKeys(selectedPurpose.canReadMembers);
    }
  }, [selectedPurpose]);

  const handleModalClose = () => {
    setTargetKeys([]);
    setSearchValue('');
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

  const filteredUsers = users
    .filter(user => user.username.includes(searchValue) && searchValue.length >= 3 && !targetKeys.includes(user._id))
    .slice(0, 5);

  const currentMembers = users.filter(user => targetKeys.includes(user._id));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = currentMembers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Modal
      width={600}
      title={selectedPurpose && selectedPurpose.name}
      open={open}
      onCancel={handleModalClose}
      footer={[
        <Button key='back' onClick={handleModalClose}>
          Cancel
        </Button>,
        <Button key='submit' ghost className='submit-blue-button' type='primary' onClick={handleSave}>
          Save
        </Button>
      ]}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <Input placeholder='Search users' value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          <List
            dataSource={filteredUsers}
            renderItem={user => (
              <List.Item
                key={user._id}
                actions={[
                  <Button
                    disabled={hasPendingRequest(user._id, selectedPurpose.name)}
                    onClick={() => handleAddUser(user._id)}>
                    Add
                  </Button>
                ]}
                style={hasPendingRequest(user._id, selectedPurpose.name) ? { color: 'gray' } : {}}>
                {user.username}
              </List.Item>
            )}
          />
        </div>
        <div style={{ width: '50%', position: 'relative', minHeight: '370px' }}>
          <h4>Current members</h4>
          <List
            style={{ overflow: 'auto', maxHeight: '370px' }}
            dataSource={paginatedMembers}
            renderItem={user => (
              <List.Item key={user._id} actions={[<Button onClick={() => handleRemoveUser(user)}>Remove</Button>]}>
                {user.username}
              </List.Item>
            )}
          />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            <Pagination
              current={currentPage}
              onChange={setCurrentPage}
              total={currentMembers.length}
              pageSize={itemsPerPage}
              hideOnSinglePage
              simple
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberList;
