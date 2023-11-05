import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Spin, Table } from 'antd';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';
import { deletePurpose, updatePurpose } from '@/services/purposes';
import EditMemberList from './EditMemberList';
import NewPurpose from './NewPurpose';
import { useMutation } from 'react-query';

const PurposesList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [open, setOpen] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [editField, setEditField] = useState(null);

  const [openNewPurpose, setOpenNewPurpose] = useState(false);

  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [purposes, setPurposes] = useState(null);

  const { canWritePurposes, isLoading, refetchPurposes } = useSettingsPermissions(user);

  useEffect(() => {
    if (!isLoading) {
      setPurposes(canWritePurposes);
    }
  }, [isLoading, canWritePurposes]);

  const updatePurposeMutation = useMutation(updatePurpose, {
    onSuccess: updatedPurpose => {
      setPurposes(prevPurposes => {
        const index = prevPurposes.findIndex(purpose => purpose._id === updatedPurpose._id);

        if (index !== -1) {
          const updatedPurposes = [...prevPurposes];
          updatedPurposes[index] = updatedPurpose;
          return updatedPurposes;
        }

        return prevPurposes;
      });
    }
  });

  const deletePurposeMutation = useMutation(deletePurpose);

  const handleOpen = (purpose = null, field) => {
    setSelectedPurpose(purpose);
    setNewPurpose({ name: purpose.name, description: purpose.description });
    setEditField(field);
    setOpen(true);
  };

  const handleOpenMemberList = purpose => {
    setSelectedPurpose(purpose);
    setOpenMemberList(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPurpose('');
    setSelectedPurpose(null);
  };

  const handleSave = async () => {
    await updatePurposeMutation.mutateAsync(selectedPurpose._id, newPurpose);
    handleClose();
  };

  const handleDelete = purposeId => {
    Modal.confirm({
      title: 'Are you sure you want to delete this purpose?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await deletePurposeMutation.mutateAsync(purposeId);
          await refetchPurposes();
          setPurposes(prevPurposes => prevPurposes.filter(purpose => purpose._id !== purposeId));

          console.log(`Purpose deleted`);
        } catch (error) {
          console.error('Error deleting purpose:', error);
        }
      },
      onCancel() {
        return;
      }
    });
  };

  if (isLoading) {
    return <Spin />;
  }

  const createdPurposes = purposes?.filter(purpose => purpose.creator === user._id) || [];
  const memberPurposes = purposes?.filter(purpose => purpose.creator !== user._id) || [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <>
          {text} <EditOutlined className='cursor-pointer' onClick={() => handleOpen(record, 'name')} />
        </>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <>
          {text} <EditOutlined className='cursor-pointer' onClick={() => handleOpen(record, 'description')} />
        </>
      )
    },

    {
      title: 'Edit Members',
      key: 'editMembers',
      width: '18%',
      render: (text, record) => (
        <UserSwitchOutlined
          onMouseEnter={e => (e.currentTarget.style.color = 'blue')}
          onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
          className='cursor-pointer text-lg'
          onClick={() => handleOpenMemberList(record)}
        />
      )
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <DeleteOutlined
          onMouseEnter={e => (e.currentTarget.style.color = 'red')}
          onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
          onClick={() => handleDelete(record._id)}
          className='cursor-pointer text-lg'
        />
      )
    }
  ];

  const memberColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <>{text}</>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => <>{text}</>
    }
  ];

  return (
    <div className='px-2 md:px-10'>
      <h1 className='my-4 text-xl'>Your Calendars</h1>
      <Button type='primary' ghost onClick={() => setOpenNewPurpose(true)} className='new-calendar-button'>
        + New Calendar
      </Button>
      <Table
        dataSource={createdPurposes}
        columns={columns}
        rowKey='_id'
        scroll={{ x: 'max-content' }}
        className='full-width-mobile overflow-x-auto'
      />

      <h1 className='my-4 text-xl'>Member Of</h1>
      <Table
        dataSource={memberPurposes}
        columns={memberColumns}
        rowKey='_id'
        scroll={{ x: 'max-content' }}
        className='full-width-mobile overflow-x-auto'
      />

      <Modal title='Edit Calendar' open={open} onCancel={handleClose} onOk={handleSave}>
        {editField === 'name' && (
          <Input
            autoFocus
            placeholder='Purpose Name'
            value={newPurpose.name}
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
        )}
        {editField === 'description' && (
          <Input
            placeholder='Purpose Description'
            value={newPurpose.description}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
        )}
      </Modal>

      <NewPurpose
        open={openNewPurpose}
        handleClose={() => setOpenNewPurpose(false)}
        refetchPurposes={refetchPurposes}
        userId={user._id}
        setPurposes={setPurposes}
      />
      <EditMemberList
        open={openMemberList}
        handleClose={() => setOpenMemberList(false)}
        selectedPurpose={selectedPurpose}
        refetchPurposes={refetchPurposes}
        user={user}
      />
    </div>
  );
});

export default PurposesList;
