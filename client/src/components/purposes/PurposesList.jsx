import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Button, Input, Modal, Spin, Table } from 'antd';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';
import { deletePurpose, updatePurpose } from '@/services/purposes';
import EditMemberList from './EditMemberList';
import NewPurpose from './NewPurpose';
import { useMutation } from 'react-query';
import { getColumns, getMemberColums } from './components/columns';
import { removeUserFromPurpose } from '../../services/purposes';
import { toast } from 'react-toastify';
import { FcCalendar } from 'react-icons/fc';

const PurposesList = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [open, setOpen] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [editField, setEditField] = useState(null);

  const [openNewPurpose, setOpenNewPurpose] = useState(false);

  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const [purposes, setPurposes] = useState([]);
  const [memberPurposes, setMemberPurposes] = useState([]);

  const { canWritePurposes, canReadPurposes, isLoading, refetchPurposes } = useSettingsPermissions(user);

  useEffect(() => {
    if (!isLoading) {
      setPurposes(canWritePurposes);
      const canRead = canReadPurposes?.filter(purpose => purpose.creator && purpose.creator._id !== user._id) || [];
      setMemberPurposes(canRead);
    }
  }, [isLoading, canWritePurposes, canReadPurposes]);

  const handleSave = async () => {
    if (!selectedPurpose) {
      console.error('No selected purpose');
      return;
    }

    try {
      const data = await updatePurpose(selectedPurpose._id, newPurpose);
      console.log(data.updatedPurpose);
      setPurposes(data.purposes);
      handleClose();
      toast.success(`Purpose ${selectedPurpose.name} updated.`);
    } catch (error) {
      toast.error(`Error updating ${selectedPurpose.name}.`);
      console.error('Error updating purpose:', error);
    }
  };

  const deletePurposeMutation = useMutation(deletePurpose, {
    onSuccess: (_, variables) => {
      const { purposeId } = variables;
      setPurposes(prevPurposes => prevPurposes.filter(purpose => purpose._id !== purposeId));
    }
  });

  const handleLeave = async purpose => {
    Modal.confirm({
      title: 'Are you sure you want to leave this calendar?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await removeUserFromPurpose(purpose.name, user._id);
          await refetchPurposes();
          setMemberPurposes(prevPurposes => prevPurposes.filter(p => p._id !== purpose._id));
          toast.success(`Successfully left calendar.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
        } catch (error) {
          toast.error(`Error leaving calendar.`, {
            autoClose: 1500,
            pauseOnFocusLoss: false
          });
          console.error('Error leaving calendar:', error);
        }
      },
      onCancel() {
        return;
      }
    });
  };

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
    setNewPurpose({ name: '', description: '' });
    setSelectedPurpose(null);
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
  const createdPurposes = purposes?.filter(purpose => purpose.creator && purpose.creator._id === user._id) || [];
  const memberColumns = getMemberColums(handleLeave);
  const columns = getColumns(handleOpen, handleOpenMemberList, handleDelete);

  return (
    <div className='px-0 md:px-10'>
      <h1 className='my-4 text-xl'>Your Calendars</h1>
      <Button
        className='flex items-center basic-btn purple-light-full new-calendar-button'
        onClick={() => setOpenNewPurpose(true)}
      >
        <span style={{ marginRight: '8px' }}>
          <FcCalendar />
        </span>
        <span style={{ fontWeight: 'bold' }}>New Calendar </span>{' '}
      </Button>
      <Table
        dataSource={createdPurposes}
        columns={columns}
        rowKey='_id'
        scroll={{ x: true }}
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
        createdPurposes={createdPurposes}
        setPurposes={setPurposes}
        refetchPurposes={refetchPurposes}
        userId={user._id}
        handleClose={() => setOpenNewPurpose(false)}
      />
      <EditMemberList
        open={openMemberList}
        handleClose={() => setOpenMemberList(false)}
        selectedPurpose={selectedPurpose}
        setSelectedPurpose={setSelectedPurpose}
        refetchPurposes={refetchPurposes}
        user={user}
      />
    </div>
  );
});

export default PurposesList;
