import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Autocomplete,
  Stack,
  Chip,
  LinearProgress
} from '@mui/material';
import { updatePurpose } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';
import MemberList from './MemberList';

const EditMemberList = ({ open, handleClose, refetchPurposes, selectedPurpose }) => {
  const [newMembers, setNewMembers] = useState({ canReadMembers: [], canWriteMembers: [] });
  const { data, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const handleAddMember = (type, newValue) => {
    setNewMembers(prevState => ({
      ...prevState,
      [type]: newValue.map(user => user._id)
    }));
  };

  const handleSave = async () => {
    const updatedPurpose = {
      ...selectedPurpose,
      canReadMembers: [...selectedPurpose.canReadMembers, ...newMembers.canReadMembers],
      canWriteMembers: [...selectedPurpose.canWriteMembers, ...newMembers.canWriteMembers]
    };
    await updatePurpose(selectedPurpose._id.toString(), updatedPurpose);
    refetchPurposes();
    handleClose();
  };

  if (isLoadingUsers) {
    return <LinearProgress />;
  }

  const canReadUsers = selectedPurpose ? data.filter(u => !selectedPurpose.canReadMembers.includes(u._id)) : [];
  const canWriteUsers = selectedPurpose ? data.filter(u => !selectedPurpose.canWriteMembers.includes(u._id)) : [];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontStyle: 'italic', fontFamily: 'Inter' }}>
        {selectedPurpose && selectedPurpose.name}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ my: 2 }} spacing={3}>
          <Autocomplete
            multiple
            id='canReadMembers'
            options={canReadUsers || []}
            getOptionLabel={option => `${option.username} (${option.email})`}
            filterOptions={(options, { inputValue }) => {
              if (inputValue.length >= 2) {
                return options.filter(
                  option =>
                    option.username.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.email.toLowerCase().includes(inputValue.toLowerCase())
                );
              }
              return [];
            }}
            onChange={(event, newValue) => handleAddMember('canReadMembers', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={`${option.username} (${option.email})`} {...getTagProps({ index })} />
              ))
            }
            noOptionsText='Type to find people'
            renderInput={params => <TextField {...params} label='Viewer Permissions' />}
          />

          <MemberList selectedPurpose={selectedPurpose} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMemberList;
