import { observer } from 'mobx-react';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Progress, Table } from 'antd';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';
import { deletePurpose, updatePurpose } from '@/services/purposes';
import EditMemberList from './EditMemberList';
import NewPurpose from './NewPurpose';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const PurposesList = observer(() => {
  const [open, setOpen] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);

  const [openNewPurpose, setOpenNewPurpose] = useState(false);

  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const { purposes, isLoading, refetchPurposes } = useSettingsPermissions(user);

  const handleOpen = (purpose = null) => {
    setSelectedPurpose(purpose);
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
    await updatePurpose(selectedPurpose._id.toString(), { ...selectedPurpose, newPurpose });
    await refetchPurposes();
    handleClose();
  };

  const handleDelete = async purposeId => {
    if (window.confirm('Are you sure you want to delete this purpose?')) {
      await deletePurpose(purposeId);
      console.log(`Purpose  deleted`);
      await refetchPurposes();
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type='primary' className='custom-hover-button' onClick={() => handleOpen(record)}>
          Edit Name
        </Button>
      )
    },
    {
      title: 'Edit Members',
      key: 'editMembers',
      render: (text, record) => <Button type='primary' className='custom-hover-button' onClick={() => handleOpenMemberList(record)}>Edit Members</Button>
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Button
          type='link'
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record._id)}
          style={{ color: 'inherit' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'red')}
          onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
        />
      )
    }
  ];

  if (isLoading) {
    return <Progress percent={100} status='active' />;
  }

  return (
    <div style={{ paddingInline: '10px' }}>
      <h1 className='my-4 text-xl'>Calendars</h1>
      <Button type='primary' ghost onClick={() => setOpenNewPurpose(true)} className='new-calendar-button'>
        + New Calendar
      </Button>
      <Table dataSource={purposes} columns={columns} rowKey='_id' />

      <Modal title='Edit Calendar' open={open} onCancel={handleClose} onOk={handleSave}>
        <Input
          autoFocus
          placeholder='Purpose Name'
          value={(selectedPurpose && selectedPurpose.name) || ''}
          onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
        />
        <Input
          placeholder='Purpose Description'
          value={(selectedPurpose && selectedPurpose.description) || ''}
          onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
        />
      </Modal>

      <NewPurpose
        open={openNewPurpose}
        handleClose={() => setOpenNewPurpose(false)}
        refetchPurposes={refetchPurposes}
        user={user}
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