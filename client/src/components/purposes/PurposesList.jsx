import { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress
} from '@mui/material';
import { updatePurpose, deletePurpose } from '@/services/purposes';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';
import NewPurpose from './NewPurpose';
import EditMemberList from './EditMemberList';
import { Delete } from '@mui/icons-material';

const PurposesList = observer(() => {
  const [open, setOpen] = useState(false);
  const [openMemberList, setOpenMemberList] = useState(false);

  const [openNewPurpose, setOpenNewPurpose] = useState(false);

  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const { user, purposes, isLoading, userLoading, refetchPurposes } = useSettingsPermissions();

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
    await deletePurpose(purposeId);
    console.log(`Purpose  deleted`);
    await refetchPurposes();
  };

  if (userLoading || isLoading) {
    return <LinearProgress />;
  }

  return (
    <Paper sx={{ width: '80%', margin: '0 auto', mt: 3 }}>
      <TableContainer>
        <Typography
          variant='h5'
          align='left'
          sx={{
            backgroundColor: '#0066b2',
            color: 'white',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px',
            padding: '1rem',
            mb: 2
          }}>
          Purposes
        </Typography>
        <Button
          variant='contained'
          color='primary'
          sx={{ marginLeft: '10px' }} // Adjust the margin value as needed
          onClick={() => setOpenNewPurpose(true)}>
          + Create New Event Purpose
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Edit Members</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purposes &&
              purposes.map(purpose => (
                <TableRow key={purpose._id}>
                  <TableCell>{purpose.name}</TableCell>
                  <TableCell>{purpose.description}</TableCell>

                  <TableCell>
                    <Button variant='outlined' color='primary' onClick={() => handleOpen(purpose)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant='outlined' color='secondary' onClick={() => handleOpenMemberList(purpose)}>
                      Edit Members
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton variant='outlined' color='error' onClick={() => handleDelete(purpose._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for editing purpose */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Purpose</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Purpose Name'
            fullWidth
            value={(selectedPurpose && selectedPurpose.name) || ''}
            onChange={e => setNewPurpose({ ...newPurpose, name: e.target.value })}
          />
          <TextField
            autoFocus
            margin='dense'
            label='Purpose Description'
            fullWidth
            value={(selectedPurpose && selectedPurpose.description) || ''}
            onChange={e => setNewPurpose({ ...newPurpose, description: e.target.value })}
          />
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
    </Paper>
  );
});

export default PurposesList;
