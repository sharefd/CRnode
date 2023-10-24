import { useState } from 'react';
import { Container, Button, TextField, List, ListItem, ListItemText, Modal, Box } from '@mui/material';
import EditPermissions from './EditPermissions';
import userStore from '@/stores/userStore';

const PasswordPrompt = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');

  return (
    <Box sx={{ display: 'flex', mt: 4, alignItems: 'center' }}>
      <TextField
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        label='Enter Password'
        variant='outlined'
      />
      <Button
        variant='contained'
        color='primary'
        onClick={() => onPasswordSubmit(password)}
        sx={{ height: '100%', ml: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

const Admin = ({ resource }) => {
  const users = resource.users.read();
  const permissions = resource.permissions.read();

  const usersPermissions = users.map(user => {
    return {
      user,
      permissions: permissions.filter(perm => perm.userId === user._id)
    };
  });
  console.log(usersPermissions);

  const [passwordEntered, setPasswordEntered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleModal = user => {
    const userWithPermissions = usersPermissions.find(up => up.user._id === user._id);
    setCurrentUser(userWithPermissions);
    setOpenModal(!openModal);
  };

  const onPasswordSubmit = password => {
    if (password === 'admin') {
      setPasswordEntered(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <Container>
      {/* {!passwordEntered ? <PasswordPrompt onPasswordSubmit={onPasswordSubmit} /> : <UserList users={users} />} */}
      <List>
        {usersPermissions.map(up => (
          <ListItem key={up.user._id}>
            <ListItemText
              primary={up.user.username}
              secondary={`Permissions: ${up.permissions
                .filter(perm => perm.canRead)
                .map(p => p.purpose)
                .join(', ')}`}
            />
            <Button onClick={() => toggleModal(up.user)}>Edit Permissions</Button>
          </ListItem>
        ))}
      </List>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'>
        <div>
          <EditPermissions
            userPermissions={currentUser}
            setUser={setCurrentUser}
            closeModal={() => setOpenModal(false)}
          />
        </div>
      </Modal>
    </Container>
  );
};

export default Admin;
