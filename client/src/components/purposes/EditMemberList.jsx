import { useState, useEffect } from 'react';
import { Modal, Button, Spin, Pagination, AutoComplete } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { fetchUsers } from '@/services/users';
import { fetchRequests, createRequest, createBulkRequests } from '@/services/requests';
import { toast } from 'react-toastify';
import InviteByEmail from './InviteByEmail';
import CurrentMembersList from './components/CurrentMembersList';
import { RiAdminFill } from 'react-icons/ri';
import { deleteRequest } from '@/services/requests';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose, setSelectedPurpose }) => {
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);
  const {
    data: fetchedRequests,
    isLoading: isRequestsLoading,
    refetch: refetchRequests
  } = useQuery('requests', fetchRequests);
  const [requests, setRequests] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [targetKeys, setTargetKeys] = useState([]);
  const [deltaTargetKeys, setDeltaTargetKeys] = useState([]);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [options, setOptions] = useState([]);

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

  useEffect(() => {
    if (selectedPurpose) {
      const members = selectedPurpose.canReadMembers.map(u => u._id);
      setTargetKeys(members);
    }
  }, [selectedPurpose]);

  useEffect(() => {
    if (fetchedRequests) {
      setRequests(fetchedRequests);
    }
  }, [fetchedRequests]);

  const onSelect = userId => {
    setTargetKeys(prevKeys => [...prevKeys, userId]);
    setDeltaTargetKeys(prev => [...prev, userId]);
    setSearchValue('');
  };

  const onSearch = (search, option) => {
    setSearchValue(search);
    const availablemembers = users
      .filter(u => !targetKeys.includes(u._id))
      .filter(u => !hasPendingRequest(u._id, selectedPurpose.name));
    const value = search.toLowerCase();

    const filteredUsers = availablemembers
      .filter(user => {
        return (
          (user.username.substring(0, user.email.indexOf('@')).toLowerCase().includes(value) && value.length >= 3) ||
          (user.email.substring(0, user.email.indexOf('@')).includes(value) && value.length >= 5)
        );
      })
      .slice(0, 5)
      .map(user => ({
        ...user,
        value: user._id,
        label: `${user.username} (${user.email})`
      }));
    setOptions(filteredUsers);
  };

  const createBulkRequestMutation = useMutation(([userIds, purposeId]) => createBulkRequests(userIds, purposeId), {
    onSuccess: data => {
      setRequests(prevRequests => [...prevRequests, ...data.requests]);
      toast.success(`Requests for ${data.requests.length} users have been created.`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    },
    onError: error => {
      toast.error(`Error creating requests: ${error.message}`, {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
      console.error('Error creating requests:', error);
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createBulkRequestMutation.mutateAsync([deltaTargetKeys, selectedPurpose._id]);
      setDeltaTargetKeys([]);
      refetchPurposes();
    } catch (error) {
      toast.error(`Error creating requests: ${error.message}`);
      console.error('Error creating requests:', error);
    } finally {
      setIsSaving(false);
      handleModalClose();
    }
  };

  const handleRemovePendingUser = async user => {
    const purposeRequests = requests.filter(r => r.user._id === user._id);
    const request = purposeRequests.find(r => r.purpose.name === selectedPurpose.name);
    if (!request) return;
    Modal.confirm({
      title: 'Are you sure you want to remove the pending member?',
      content: `This will remove ${user.username} from ${selectedPurpose.name}.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteRequest(request._id);
          toast.success(`Success: Removed ${user.username} from ${selectedPurpose.name}.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
          setRequests(prevRequests => prevRequests.filter(req => req._id !== request._id));
          setTargetKeys(prevKeys => prevKeys.filter(key => key !== user._id));
          await refetchRequests();
        } catch (error) {
          toast.error(`Error while removing ${user.username} from ${selectedPurpose.name}.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
          console.error('Error removing user:', error);
        }
      },
      onCancel() {}
    });
  };

  const handleModalClose = () => {
    setOptions([]);
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

  const currentMembers = users.filter(
    user => targetKeys.includes(user._id) || hasPendingRequest(user._id, selectedPurpose && selectedPurpose.name)
  );

  const unregisteredEmails = selectedPurpose
    ? selectedPurpose.emailMemberList.filter(email => !users.some(user => user.email === email))
    : [];

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentAndUnregistered = [...currentMembers, ...unregisteredEmails];

  const paginatedMembers = currentAndUnregistered.slice(startIndex, startIndex + itemsPerPage);

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
    } else if (deltaTargetKeys.length > 0) {
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
      {/* Autocomplete Search Bar */}
      <div className='flex mb-3 mt-3 w-[98%]'>
        <AutoComplete
          className='mr-auto'
          options={options}
          style={{ width: '75%' }}
          value={searchValue}
          onSelect={onSelect}
          onChange={(value, option) => onSearch(value, option)}
          placeholder='Search users'
          allowClear
        />
        <InviteByEmail
          selectedPurpose={selectedPurpose}
          setSelectedPurpose={setSelectedPurpose}
          isEmailModalOpen={isEmailModalOpen}
          setEmailModalOpen={setEmailModalOpen}
          createRequestMutation={createRequestMutation}
          refetchPurposes={refetchPurposes}
        />
      </div>

      <div className='member-row member-current' style={{ width: '100%', position: 'relative', minHeight: '370px' }}>
        <p className='member-row-title'>Subscribers</p>
        <CurrentMembersList
          members={paginatedMembers}
          hasPendingRequest={hasPendingRequest}
          selectedPurpose={selectedPurpose}
          setTargetKeys={setTargetKeys}
          deltaTargetKeys={deltaTargetKeys}
          setDeltaTargetKeys={setDeltaTargetKeys}
          handleRemovePendingUser={handleRemovePendingUser}
        />
        <div
          className='flex justify-end items-center'
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '2px'
          }}>
          {/* Creator's details at the bottom right */}
          <div
            className='flex justify-end items-center'
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '2px'
            }}></div>
          <div className='text-blue-400 text-xs mr-1 italic'>
            {selectedPurpose?.creator.username}
            {/* <i style={{ fontSize: '11px', padding: 0, margin: 0 }}>{`(${creator && creator.email})`}</i> */}
          </div>
          <RiAdminFill className='text-blue-400 mr-2 text-sm' />
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberList;
