import { bulkUpdatePurposes } from '@/services/purposes';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useMutation } from 'react-query';

const EditPermissions = ({ purposes, userPermissions, setUser, closeModal, setUsersPermissions }) => {
  const mutation = useMutation(bulkUpdatePurposes, {
    onSuccess: async () => {
      console.log('Purposes/permissions updated successfully');
      closeModal();
    },
    onError: error => {
      console.error('Error updating purposes/permissions:', error);
    }
  });

  const handleSavePermissions = () => {
    mutation.mutate(userPermissions);
  };

  const handlePermissionChange = (e, purposeName) => {
    const { name, checked } = e.target;

    let updatedPermissions = [...userPermissions[name]];

    if (checked) {
      updatedPermissions = [...updatedPermissions, purposeName];
    } else {
      updatedPermissions = updatedPermissions.filter(p => p !== purposeName);
    }

    const updatedUserPermissions = {
      ...userPermissions,
      [name]: updatedPermissions
    };

    setUser(updatedUserPermissions);

    setUsersPermissions(prevUsersPermissions => {
      return prevUsersPermissions.map(userPerm => {
        if (userPerm.user._id === updatedUserPermissions.user._id) {
          return updatedUserPermissions;
        }
        return userPerm;
      });
    });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
      }}>
      <Typography id='modal-title' variant='h6' component='h2'>
        Edit Permissions for {user?.username}
      </Typography>
      <form noValidate autoComplete='off'>
        {purposes &&
          purposes.map(purpose => (
            <Box key={purpose.name}>
              <Typography>{purpose.name}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userPermissions.canReadPermissions.includes(purpose.name)}
                    onChange={e => handlePermissionChange(e, purpose.name)}
                    name='canReadPermissions'
                  />
                }
                label='Read'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userPermissions.canWritePermissions.includes(purpose.name)}
                    onChange={e => handlePermissionChange(e, purpose.name)}
                    name='canWritePermissions'
                  />
                }
                label='Write'
              />
            </Box>
          ))}
        <Button onClick={handleSavePermissions}>Save</Button>
      </form>
    </Box>
  );
};
export default EditPermissions;
