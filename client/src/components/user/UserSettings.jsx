import { observer } from 'mobx-react';
import {
  Avatar,
  List,
  ListItem,
  Box,
  IconButton,
  Button,
  LinearProgress,
  TextField,
  Grid,
  Typography,
  Dialog,
  MenuItem,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import { updateUser, deleteUser } from '@/services/users';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/dates';
import { Check, Clear } from '@mui/icons-material';
import PasswordChange from './PasswordChange';
import { UNIVERSITY_CHOICES } from '@/utils/constants';
import Pencil from '@/assets/images/edit.png';
import { useMutation, useQueryClient } from 'react-query';
import { grey } from '@mui/material/colors';
import useSettingsPermissions from '@/hooks/useSettingsPermissions';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const UserSettings = observer(() => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const { purposes, canWritePurposes, canReadPurposes, isLoading } = useSettingsPermissions(user);

  const mutation = useMutation(updateUser, {
    onSuccess: data => {
      queryClient.invalidateQueries('currentUser');
      toast.success('Field updated successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
    },
    onError: error => {
      toast.error(error.message || 'Error updating field. Please try again.', {
        autoClose: 2000,
        pauseOnFocusLoss: false
      });
    }
  });

  useEffect(() => {
    if (!isLoading) {
      const newValues = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        canRead: canReadPurposes,
        canWrite: canWritePurposes,
        university: user.university
      };
      setTempValues(newValues);
    }
  }, [isLoading]);

  const handleFieldUpdate = async (field, newValue) => {
    const updatedUser = { _id: user._id, [field]: newValue };
    mutation.mutate(updatedUser);
  };

  const handleEditToggle = field => {
    setEditingField(field);
    setTempValues(prevValues => ({ ...prevValues, [field]: user[field] }));
  };

  const areFieldsValid = () => {
    return ['username', 'firstName', 'lastName', 'email', 'university'].every(field => !!tempValues[field]);
  };

  const handleSaveAll = async field => {
    if (areFieldsValid()) {
      await handleFieldUpdate(field, tempValues[field]);
    } else {
      toast.error(`Invalid or empty fields.`, { autoClose: 2000, pauseOnFocusLoss: false });
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleChange = (field, event) => {
    setTempValues(prevValues => ({ ...prevValues, [field]: event.target.value }));
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user._id);

      toast.success('Account deleted successfully!', { autoClose: 2000, pauseOnFocusLoss: false });
    } catch (error) {
      toast.error('Error deleting account. Please try again.', { autoClose: 2000, pauseOnFocusLoss: false });
    }
    setOpenDeleteDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderField = (label, field, choices) => (
    <Box
      sx={{
        width: editingField === field ? '70%' : '95%',
        marginBottom: '1rem'
      }}>
      <Typography variant='subtitle2' sx={{ color: grey[900] }}>
        {label}
      </Typography>
      <Box
        sx={{
          backgroundColor: '#F9FAFC',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center'
        }}>
        {editingField === field ? (
          <>
            {choices ? (
              <TextField
                variant='standard'
                autoFocus
                id={label}
                inputProps={{ id: label }}
                name={label}
                required
                select
                fullWidth
                value={tempValues[field]}
                sx={{ border: 'none', p: '8px' }}
                onChange={e => handleChange(field, e)}>
                {choices.map((choice, index) => (
                  <MenuItem key={index} value={choice.label}>
                    {choice.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : editingField === 'password' ? (
              <div style={{ width: '85%' }}>
                <PasswordChange
                  userId={user._id}
                  onSuccess={() => setShowPasswordChange(false)}
                  onCancel={handleCancel}
                />
              </div>
            ) : (
              <TextField
                variant='standard'
                autoFocus
                fullWidth
                value={tempValues[field]}
                sx={{ border: 'none', p: '4px' }}
                onChange={e => handleChange(field, e)}
              />
            )}
            {editingField !== 'password' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', alignItems: 'center' }}>
                <IconButton onClick={() => handleSaveAll(field)}>
                  <Check sx={{ fontSize: '18px', color: 'green' }} />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <Clear sx={{ fontSize: '18px', color: 'red' }} />
                </IconButton>
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              position: 'relative',
              padding: '0.6rem',
              width: '100%'
            }}>
            {field === 'password' ? (
              <Typography sx={{ color: grey[900] }}>••••••••</Typography>
            ) : (
              <Typography sx={{ color: grey[900] }}>{user[field]}</Typography>
            )}
            <IconButton
              onClick={() => handleEditToggle(field)}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                padding: '8px'
              }}>
              <img src={Pencil} style={{ width: '12px' }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isLoading || !user) {
    return <LinearProgress />;
  }

  const initials = user ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : '';

  return (
    <Paper sx={{ maxWidth: '600px', margin: '0 auto', mt: 3, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0066b2',
          color: 'white',
          borderTopRightRadius: '5px',
          borderTopLeftRadius: '5px',
          padding: '1rem',
          mb: 4
        }}>
        <Typography variant='h5' align='left'>
          Account Settings
        </Typography>
        <Avatar
          style={{
            backgroundColor: '#fff',
            color: '#0066b2',
            padding: '1.3rem',
            border: '1px solid #fff',
            fontSize: '16px'
          }}>
          {initials}
        </Avatar>
      </Box>

      <Box sx={{ px: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Box sx={{ marginTop: '1rem' }}>
          <Typography variant='overline' sx={{ my: '1rem', color: grey[900], fontSize: '16px' }}>
            LOGIN INFORMATION
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
              {renderField('Username', 'username')}
            </Grid>
            <Grid item xs={12} md={12}>
              {renderField('Password', 'password')}
            </Grid>
          </Grid>

          <Box sx={{ marginTop: '1rem' }}>
            <Typography variant='overline' sx={{ my: '1rem', color: grey[900], fontSize: '16px' }}>
              PROFILE DETAILS
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={12} md={12}>
                {renderField('First Name', 'firstName')}
              </Grid>
              <Grid item xs={12} md={12}>
                {renderField('Last Name', 'lastName')}
              </Grid>
              <Grid item xs={12} md={12}>
                {renderField('Email', 'email')}
              </Grid>
              <Grid item xs={12} md={12}>
                {renderField('University', 'university', UNIVERSITY_CHOICES.slice(1))}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginTop: '1.5rem' }}>
            <Typography variant='overline' sx={{ my: '1rem', color: grey[900], fontSize: '16px' }}>
              ATTENDED ARTICLES
            </Typography>
            <List sx={{ listStyle: 'decimal', pl: 4 }}>
              {user.attended.map((article, index) => (
                <ListItem key={index} sx={{ display: 'list-item' }}>
                  {article.title}
                  <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                    ({formatDate(article.date)})
                  </span>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ marginTop: '1.5rem' }}>
            <Typography variant='overline' sx={{ my: '1rem', color: grey[900], fontSize: '16px' }}>
              PERMISSIONS
            </Typography>
            {user && (
              <List sx={{ listStyle: 'disc', pl: 4 }}>
                <ListItem key='canRead' sx={{ display: 'list-item' }}>
                  Can View:
                  <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                    {canReadPurposes && canReadPurposes.map(p => p.name).join(', ')}
                  </span>
                </ListItem>
                <ListItem key='canWrite' sx={{ display: 'list-item' }}>
                  Can Create:
                  <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>
                    {canWritePurposes && canWritePurposes.map(p => p.name).join(', ')}
                  </span>
                </ListItem>
              </List>
            )}
          </Box>

          <Box sx={{ marginTop: '2rem' }}>
            <Typography variant='overline' sx={{ my: '1rem', color: grey[900], fontSize: '16px' }}>
              DANGER ZONE
            </Typography>
            <div>
              <Button
                variant='text'
                color='primary'
                onClick={handleClickOpen}
                sx={{
                  mb: 5,
                  mt: 1,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' }
                }}>
                Delete Account
              </Button>
            </div>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button onClick={handleDeleteAccount} color='primary'>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Paper>
  );
});

export default UserSettings;
