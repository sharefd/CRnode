import LockIcon from '@mui/icons-material/Lock';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import { changePassword } from '../../services/users';
import { toast } from 'react-toastify';
import { Clear } from '@mui/icons-material';

const PasswordChange = ({ userId, onSuccess, onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    try {
      await changePassword(userId, currentPassword, newPassword);
      onSuccess();
      toast.success('Password updated successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
    } catch (error) {
      toast.error(`Error updating password. ${error.data} Please try again.`, {
        autoClose: 2000,
        pauseOnFocusLoss: false
      });
    }
  };

  return (
    <Box sx={{ px: '1rem', pb: 3, pt: 1, position: 'relative' }}>
      <IconButton onClick={onCancel} sx={{ position: 'absolute', top: '10px', right: '-45px', zIndex: 1 }}>
        <Clear sx={{ fontSize: '18px', color: 'red' }} />
      </IconButton>
      <TextField
        variant='standard'
        size='small'
        fullWidth
        type='password'
        label='Current Password'
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        margin='dense'
      />
      <TextField
        variant='standard'
        size='small'
        fullWidth
        type='password'
        label='New Password'
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        margin='dense'
      />
      <TextField
        variant='standard'
        size='small'
        fullWidth
        type='password'
        label='Confirm New Password'
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        margin='dense'
      />
      <div style={{ width: '100%' }}>
        <Button
          variant='contained'
          size='small'
          color='primary'
          onClick={handleChangePassword}
          sx={{ marginTop: '1.5rem' }}>
          Submit
        </Button>
      </div>
    </Box>
  );
};
export default PasswordChange;
