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
import { createPurpose } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchUsers } from '@/services/users';

const NewPurpose = ({ open, handleClose, refetchPurposes, user }) => {
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '', canReadMembers: [], canWriteMembers: [] });

  const { data, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const handleAddMember = (type, newValue) => {
    setNewPurpose(prevState => ({
      ...prevState,
      [type]: newValue.map(user => user._id)
    }));
  };

  const handleSave = async () => {
    console.log(newPurpose);
    await createPurpose(user._id, newPurpose);
    await refetchPurposes();
    handleClose();
  };

  if (isLoadingUsers) {
    return <LinearProgress />;
  }

  const users = data.filter(u => u._id !== user._id);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Purpose</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Purpose Name'
          fullWidth
          onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
        />
        <TextField
          margin='dense'
          label='Description'
          fullWidth
          onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
        />
        <Stack sx={{ my: 2 }} spacing={3}>
          <Autocomplete
            multiple
            id='canReadMembers'
            options={users || []}
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
          <Autocomplete
            multiple
            id='canWriteMembers'
            options={users || []}
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
            onChange={(event, newValue) => handleAddMember('canWriteMembers', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={`${option.username} (${option.email})`} {...getTagProps({ index })} />
              ))
            }
            noOptionsText='Type to find people'
            renderInput={params => <TextField {...params} label='Author Permissions' />}
          />
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

export default NewPurpose;
