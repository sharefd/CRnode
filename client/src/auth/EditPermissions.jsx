import { FormControlLabel, Checkbox, Box, Typography, Button } from '@mui/material';

const EditPermissions = ({ user }) => {
  const handlePermissionChange = (event, purpose) => {
    const { name, checked } = event.target;
    let updatedPermissions = [...user.permissions];

    const permissionIndex = updatedPermissions.findIndex(p => p.purpose === purpose);
    if (permissionIndex !== -1) {
      updatedPermissions[permissionIndex][name] = checked;
    }

    setuser({
      ...user,
      permissions: updatedPermissions
    });
  };

  const savePermissions = () => {
    axios
      .put(`http://localhost:3001/api/users/edit-permissions/${user._id}`, {
        permissions: user.permissions
      })
      .then(response => {
        console.log('Permissions updated:', response.data);
        setOpenModal(false);
      })
      .catch(error => {
        console.error('Error updating permissions:', error);
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
        {user.permissions.map(permission => (
          <Box key={permission.purpose}>
            <Typography>{permission.purpose}</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={permission.canRead}
                  onChange={e => handlePermissionChange(e, permission.purpose)}
                  name='canRead'
                />
              }
              label='Read'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={permission.canWrite}
                  onChange={e => handlePermissionChange(e, permission.purpose)}
                  name='canWrite'
                />
              }
              label='Write'
            />
          </Box>
        ))}
        <Button onClick={savePermissions}>Save</Button>
      </form>
    </Box>
  );
};
export default EditPermissions;