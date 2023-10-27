import LockIcon from '@mui/icons-material/Lock';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { changePassword } from '../../services/users';
import { toast } from 'react-toastify';

const PasswordChange = ({ userId, onSuccess }) => {
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
    <Box sx={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <Typography variant='h6' sx={{ marginBottom: '1rem' }}>
        <LockIcon sx={{ verticalAlign: 'middle', marginRight: '10px' }} />
        Change Password
      </Typography>
      <TextField
        fullWidth
        type='password'
        label='Current Password'
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        variant='outlined'
        margin='normal'
      />
      <TextField
        fullWidth
        type='password'
        label='New Password'
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        variant='outlined'
        margin='normal'
      />
      <TextField
        fullWidth
        type='password'
        label='Confirm New Password'
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        variant='outlined'
        margin='normal'
      />
      <Button variant='contained' color='primary' onClick={handleChangePassword} sx={{ marginTop: '1rem' }}>
        Submit
      </Button>
    </Box>
  );
};
export default PasswordChange;
