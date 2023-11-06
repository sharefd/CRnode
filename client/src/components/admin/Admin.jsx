import useSuperAdmin from '@/hooks/useSuperAdmin';
import { bulkUpdatePurposes, fetchPurposes } from '@/services/purposes';
import { Button, Modal, Spin, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import MemberList from './MemberList';
import AccessDenied from './AccessDenied';

const Admin = () => {
  const { data, isLoading: isLoadingPurposes } = useQuery('purposes', () => fetchPurposes());
  const [openModal, setOpenModal] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const [purposes, setPurposes] = useState([]);

  const { isSuperAdmin, isLoading: isSuperAdminCheckLoading, isError } = useSuperAdmin();

  useEffect(() => {
    if (!isLoadingPurposes) {
      setPurposes(data);
    }
  }, [isLoadingPurposes]);

  const mutation = useMutation(bulkUpdatePurposes, {
    onSuccess: data => {
      setPurposes(prevPurposes => prevPurposes.map(p => (p._id === data._id ? data : p)));
      console.log('Purposes/permissions updated successfully');
      closeModal();
    },
    onError: error => {
      console.error('Error updating purposes/permissions:', error);
    }
  });

  const handleSavePermissions = () => {
    mutation.mutate(selectedPurpose);
  };

  const handlePermissionChange = (memberId, type) => {
    setPurposes(prevPurposes => {
      return prevPurposes.map(p => {
        if (p._id === selectedPurpose._id) {
          const updatedPurpose = { ...p };
          if (type === 'canRead') {
            if (updatedPurpose.canReadMembers.includes(memberId)) {
              updatedPurpose.canReadMembers = updatedPurpose.canReadMembers.filter(id => id !== memberId);
            } else {
              updatedPurpose.canReadMembers.push(memberId);
            }
          } else if (type === 'canWrite') {
            if (updatedPurpose.canWriteMembers.includes(memberId)) {
              updatedPurpose.canWriteMembers = updatedPurpose.canWriteMembers.filter(id => id !== memberId);
            } else {
              updatedPurpose.canWriteMembers.push(memberId);
            }
          }
          return updatedPurpose;
        }
        return p;
      });
    });
  };

  if (mutation.isLoading) {
    return <Spin />;
  }

  const renderMemberCount = members => members?.length || 0;

  const columns = [
    {
      title: 'Purpose',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Can View',
      dataIndex: 'canReadMembers',
      key: 'canReadMembers',
      render: renderMemberCount
    },
    {
      title: 'Can Write',
      dataIndex: 'canWriteMembers',
      key: 'canWriteMembers',
      render: renderMemberCount
    },
    {
      title: 'Creator',
      dataIndex: ['creator', 'username'],
      key: 'creator'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedPurpose(record);
            setOpenModal(true);
          }}>
          Edit Permissions
        </Button>
      )
    }
  ];

  const handleCloseModal = () => {
    setSelectedPurpose(null);
    setOpenModal(false);
  };

  if (isLoadingPurposes || isSuperAdminCheckLoading) {
    return <Spin />;
  }

  if (isError || !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <div>
      <Table dataSource={purposes} columns={columns} rowKey='_id' />
      {selectedPurpose && (
        <Modal
          title={`Edit Permissions for ${selectedPurpose.name}`}
          open={openModal}
          onOk={handleSavePermissions}
          onCancel={handleCloseModal}
          footer={[
            <Button key='back' onClick={handleCloseModal}>
              Cancel
            </Button>,
            <Button key='submit' type='primary' onClick={handleSavePermissions}>
              Save
            </Button>
          ]}>
          <div>
            <Typography.Text>Can Read Members ({renderMemberCount(selectedPurpose.canReadMembers)})</Typography.Text>
            <MemberList
              members={selectedPurpose.canReadMembers || []}
              type='canRead'
              handlePermissionChange={handlePermissionChange}
            />
          </div>
          <div>
            <Typography.Text>Can Write Members ({renderMemberCount(selectedPurpose.canWriteMembers)})</Typography.Text>
            <MemberList
              members={selectedPurpose.canWriteMembers || []}
              type='canWrite'
              handlePermissionChange={handlePermissionChange}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
