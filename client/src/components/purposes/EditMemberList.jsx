import { useState, useEffect } from 'react';
import { Modal, Button, Input, Spin, Pagination } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { fetchUsers } from '@/services/users';
import { fetchRequests, createRequest } from '@/services/requests';
import { toast } from 'react-toastify';
import InviteByEmail from './InviteByEmail';
import { handleRemoveUser } from './helpers/members';
import CurrentMembersList from './components/CurrentMembersList';
import UserList from './components/UserList';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose, setSelectedPurpose }) => {
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);
  const { data: fetchedRequests, isLoading: isRequestsLoading } = useQuery('requests', fetchRequests);
  const [requests, setRequests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [targetKeys, setTargetKeys] = useState([]);
  const [initialMembers, setInitialMembers] = useState([]);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const createRequestMutation = useMutation(createRequest, {
    onSuccess: data => {
      setRequests(prevRequests => [...prevRequests, data.request]);
      toast.success(`Request for ${data.request.user.username} has been created.`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    },
    onError: error => {
      toast.error(`Error creating request: ${error.message}`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
      console.error('Error creating request:', error);
    }
  });

  const handleSave = async () => {
    setIsSaving(true);

    const newMembers = targetKeys.filter(key => !selectedPurpose.canReadMembers.includes(key));
    for (const memberId of newMembers) {
      const request = {
        purposeId: selectedPurpose._id,
        userId: memberId
      };
      await createRequestMutation.mutateAsync(request);
    }

    refetchPurposes();
    setIsSaving(false);
    handleModalClose();
  };

  useEffect(() => {
    if (selectedPurpose) {
      const members = selectedPurpose.canReadMembers.map(u => u._id);
      setTargetKeys(members);
      setInitialMembers(members);
    }
  }, [selectedPurpose]);

  useEffect(() => {
    if (fetchedRequests) {
      setRequests(fetchedRequests);
    }
  }, [fetchedRequests]);

  const handleModalClose = () => {
    setSearchValue('');
    handleClose();
    setCurrentPage(1);
  };

  if (isLoadingUsers) {
    return <Spin />;
  }

  const hasPendingRequest = (userId, purpose) => {
    if (isRequestsLoading) {
      return false;
    }
    return requests.some(
      request =>
        request.user._id === userId &&
        request.purpose &&
        request.purpose.name === purpose &&
        request.status === 'Pending'
    );
  };

  const filteredUsers = users
    .filter(
      user =>
        ((user.username.toLowerCase().includes(searchValue.toLowerCase()) && searchValue.length >= 3) ||
          (user.email.substring(0, user.email.indexOf('@')).toLowerCase().includes(searchValue.toLowerCase()) &&
            searchValue.length >= 5)) &&
        !targetKeys.includes(user._id) &&
        (selectedPurpose ? !hasPendingRequest(user._id, selectedPurpose.name) : true)
    )
    .slice(0, 5);

  const currentMembers = users.filter(
    user =>
      targetKeys.includes(user._id) ||
      hasPendingRequest(
        user._id,
        selectedPurpose || hasPendingRequest(user._id, selectedPurpose && selectedPurpose.name)
      )
  );

  const unregisteredEmails = selectedPurpose
    ? selectedPurpose.emailMemberList.filter(email => !users.some(user => user.email === email))
    : [];

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentAndUnregistered = [...currentMembers, ...unregisteredEmails];

  const paginatedMembers = currentAndUnregistered.slice(startIndex, startIndex + itemsPerPage);

  const hasChanges = JSON.stringify(initialMembers) !== JSON.stringify(targetKeys);

  const FooterButtons = () => (
    <div key='buttons' className='mb-3'>
      <Button key='back' onClick={handleModalClose}>
        Cancel
      </Button>
      <Button key='submit' ghost className='submit-blue-button' type='primary' onClick={handleSave}>
        Save
      </Button>
    </div>
  );

  const FooterPagination = () => (
    <Pagination
      key='pagination'
      current={currentPage}
      onChange={setCurrentPage}
      total={currentMembers.length}
      pageSize={itemsPerPage}
      hideOnSinglePage
      simple
    />
  );

  const modalFooterContent = () => {
    if (isSaving) {
      return [<Spin key='footer-progress' />, <FooterPagination key='footer-pagination' />];
    } else if (hasChanges) {
      return [<FooterButtons key='footer-buttons' />, <FooterPagination key='footer-pagination' />];
    } else {
      return [<FooterPagination key='footer-pagination' />];
    }
  };

  return (
    <Modal
      width={600}
      title={selectedPurpose && selectedPurpose.name}
      open={open}
      onCancel={handleModalClose}
      footer={modalFooterContent()}>
      <div className='members-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='member-row member-left flex flex-col'>
          <Input placeholder='Search users' value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          <UserList users={filteredUsers} setTargetKeys={setTargetKeys} />
          <InviteByEmail
            selectedPurpose={selectedPurpose}
            setSelectedPurpose={setSelectedPurpose}
            isEmailModalOpen={isEmailModalOpen}
            setEmailModalOpen={setEmailModalOpen}
            createRequestMutation={createRequestMutation}
            refetchPurposes={refetchPurposes}
          />
        </div>
        <div className='member-row member-current' style={{ position: 'relative', minHeight: '370px' }}>
          <p className='member-row-title'>Current members</p>
          <CurrentMembersList
            members={paginatedMembers}
            handleRemoveUser={handleRemoveUser}
            hasPendingRequest={hasPendingRequest}
            selectedPurpose={selectedPurpose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberList;
