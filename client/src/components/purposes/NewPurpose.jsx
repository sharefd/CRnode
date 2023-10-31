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
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [canReadMembers, setCanReadMembers] = useState([]);
  const [canWriteMembers, setCanWriteMembers] = useState([]);

  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);

  const handleAddMember = (type, newValue) => {
    if (type === 'canReadMembers') {
      setCanReadMembers([...canReadMembers, ...newValue]);
    } else {
      setCanWriteMembers([...canWriteMembers, ...newValue]);
    }
  };

  const handleSave = async () => {
    await createPurpose(user._id, newPurpose);
    await refetchPurposes();
    handleClose();
  };

  if (isLoadingUsers) {
    return <LinearProgress />;
  }

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
          autoFocus
          margin='dense'
          label='Purpose Description'
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
            noOptionsText='Type more to see options'
            renderInput={params => <TextField {...params} label='Can Read Members' />}
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
            noOptionsText='Type more to see options'
            renderInput={params => <TextField {...params} label='Can Write Members' />}
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
