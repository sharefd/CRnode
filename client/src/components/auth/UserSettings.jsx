import { useQuery } from 'react-query';
import { fetchUserPermissions } from '@/services/permissions';
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
  Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchCurrentUser, updateUser, deleteUser } from '@/services/users';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/dates';
import { fetchCanReadPermissions, fetchCanWritePermissions } from '@/services/permissions';
import { Check, Clear } from '@mui/icons-material';
import PasswordChange from './PasswordChange';
import { UNIVERSITY_CHOICES } from '@/utils/authForm';
import Pencil from '@/assets/edit.png';
import { useMutation, useQueryClient } from 'react-query';

const UserSettings = observer(() => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const { data: user, isLoading: userLoading } = useQuery('currentUser', fetchCurrentUser);

  const { data: permissions, isLoading: permissionsLoading } = useQuery(
    ['userPermissions', user?._id],
    () => fetchUserPermissions(user._id),
    {
      enabled: !userLoading && !!user
    }
  );

  const mutation = useMutation(updateUser, {
    onSuccess: data => {
      queryClient.invalidateQueries('currentUser');
      toast.success('Field updated successfully!');
    },
    onError: error => {
      toast.error(error.message || 'Error updating field. Please try again.');
    }
  });

  useEffect(() => {
    if (user) {
      setTempValues({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university
      });
    }
  }, [user]);

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
      toast.error(`Invalid or empty fields.`);
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

      toast.success('Account deleted successfully!');
    } catch (error) {
      toast.error('Error deleting account. Please try again.');
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
    <Box sx={{ marginBottom: '1rem' }}>
      <Typography variant='subtitle2'>{label}</Typography>
      <Box sx={{ backgroundColor: '#F9FAFC', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
        {editingField === field ? (
          <>
            {choices ? (
              <TextField
                variant='standard'
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
            ) : (
              <TextField
                variant='standard'
                fullWidth
                value={tempValues[field]}
                sx={{ border: 'none', p: '4px' }}
                onChange={e => handleChange(field, e)}
              />
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', alignItems: 'center' }}>
              <IconButton onClick={() => handleSaveAll(field)}>
                <Check sx={{ fontSize: '18px', color: 'green' }} />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <Clear sx={{ fontSize: '18px', color: 'red' }} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              backgroundColor: '#F9FAFC',
              borderRadius: '5px',
              position: 'relative',
              padding: '0.5rem',
              width: '100%'
            }}>
            <Typography>{user[field]}</Typography>
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

  if (userLoading || permissionsLoading) {
    return <LinearProgress />;
  }

  const canRead = fetchCanReadPermissions(permissions);
  const canWrite = fetchCanWritePermissions(permissions);

  const initials = user ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : '';

  return (
    <Box sx={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h4'>Account Settings</Typography>
        <Avatar
          style={{
            backgroundColor: '#529FF0',
            color: 'black',
            border: '2px solid black'
          }}>
          {initials}
        </Avatar>
      </Box>
      <Box sx={{ marginTop: '1rem' }}>
        {/* User Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {renderField('Username', 'username')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField('First Name', 'firstName')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField('Last Name', 'lastName')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField('Email', 'email')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderField('University', 'university', UNIVERSITY_CHOICES.slice(1))}
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4, mt: 2 }} />

        {/* Password Change */}
        <Button
          variant='contained'
          sx={{
            backgroundColor: showPasswordChange ? '#7182fd' : '#2877cc',
            '&:hover': { backgroundColor: showPasswordChange ? '#7a8ade' : '#2077cc' }
          }}
          onClick={() => setShowPasswordChange(!showPasswordChange)}>
          {showPasswordChange ? 'Cancel' : 'Change Password'}
        </Button>
        {showPasswordChange && <PasswordChange userId={user._id} onSuccess={() => setShowPasswordChange(false)} />}

        <Divider sx={{ my: 4 }} />

        {/* Attended Articles */}
        <Typography variant='h6' sx={{ marginTop: '2rem' }}>
          Attended Articles
        </Typography>
        <List sx={{ listStyle: 'decimal', pl: 4 }}>
          {user.attended.map((article, index) => (
            <ListItem key={index} sx={{ display: 'list-item' }}>
              {article.title}
              <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>({formatDate(article)})</span>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />

        {/* User Permissions */}
        <Typography variant='h6' sx={{ marginTop: '2rem' }}>
          Permissions
        </Typography>
        {permissions && (
          <List sx={{ listStyle: 'disc', pl: 4 }}>
            <ListItem key='canRead' sx={{ display: 'list-item' }}>
              Can View:
              <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>{canRead.join(', ')}</span>
            </ListItem>
            <ListItem key='canWrite' sx={{ display: 'list-item' }}>
              Can Create:
              <span style={{ marginLeft: '6px', color: 'gray', fontSize: '0.85rem' }}>{canWrite.join(', ')}</span>
            </ListItem>
          </List>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Delete Account */}
        <Button variant='contained' color='secondary' onClick={handleClickOpen}>
          Delete Account
        </Button>
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
  );
});

export default UserSettings;
