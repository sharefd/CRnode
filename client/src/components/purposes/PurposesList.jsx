import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Paper,
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
  DialogTitle
} from '@mui/material';
import userStore from '@/stores/userStore';
import { createPurpose, fetchPurposes, updatePurpose } from '@/services/purposes';

const PurposesList = observer(() => {
  const user = userStore.user;

  const [purposes, setPurposes] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: '', description: '' });
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPurposes();
      setPurposes(data);
    };
    fetchData();
  }, []);

  const handleOpen = (purpose = null) => {
    setSelectedPurpose(purpose);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPurpose('');
    setSelectedPurpose(null);
  };

  const handleSave = async () => {
    if (selectedPurpose) {
      await updatePurpose({ ...selectedPurpose, name: newPurpose });
    } else {
      await createPurpose(user._id, newPurpose);
    }
    handleClose();
    const updatedPurposes = await fetchPurposes();
    setPurposes(updatedPurposes);
  };

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
        <Button variant='contained' color='primary' onClick={() => handleOpen()}>
          Create New Purpose
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Purpose Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purposes.map(purpose => (
              <TableRow key={purpose._id}>
                <TableCell>{purpose.name}</TableCell>
                <TableCell>
                  <Button variant='outlined' color='primary' onClick={() => handleOpen(purpose)}>
                    Edit
                  </Button>
                  {/* Add more actions like Delete, Add Members, etc. */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing purpose */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedPurpose ? 'Edit Purpose' : 'Create New Purpose'}</DialogTitle>
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
          <TableContainer>
            <Typography variant='h5' align='left' sx={{ padding: '1rem', mb: 2 }}>
              Members
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Can View</TableCell>
                  <TableCell>Can Write</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPurpose &&
                  selectedPurpose.canReadMembers.map((memberId, index) => (
                    <TableRow key={index}>
                      <TableCell>{memberId}</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>{selectedPurpose.canWriteMembers.includes(memberId) ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Button variant='outlined' color='primary' onClick={() => handleEditMembers(selectedPurpose)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
    </Paper>
  );
});

export default PurposesList;
