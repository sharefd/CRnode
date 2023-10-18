import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, TextField, List, ListItem, ListItemText, Modal, Box } from '@mui/material';
import EditPermissions from './EditPermissions';

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

const UserList = ({ users }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleModal = user => {
    setCurrentUser(user);
    setOpenModal(!openModal);
  };

  return (
    <>
      <List>
        {users.map(user => (
          <ListItem key={user._id}>
            <ListItemText
              primary={user.username}
              secondary={`Permissions: ${user.permissions.map(perm => perm.purpose).join(', ')}`}
            />
            <Button onClick={() => toggleModal(user)}>Edit Permissions</Button>
          </ListItem>
        ))}
      </List>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'>
        <div>
          <EditPermissions user={currentUser} setUser={setCurrentUser} closeModal={() => setOpenModal(false)} />
        </div>
      </Modal>
    </>
  );
};

const Admin = () => {
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // if (passwordEntered) {
    axios.get('http://localhost:3001/api/users').then(response => {
      setUsers(response.data);
    });
    // }
  }, []);
  // }, [passwordEntered]);

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
      <UserList users={users} />
    </Container>
  );
};

export default Admin;
