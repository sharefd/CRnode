import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Container, Button, List, ListItem, ListItemText, Modal } from '@mui/material';
import EditPermissions from './EditPermissions';
import { fetchUsers } from '@/services/users';
import LoadingSpinner from '../ui/LoadingSpinner';
import useArticlePermissions from '@/hooks/useArticlePermissions';

const Admin = () => {
  const { data: users, isLoading: isLoadingUsers } = useQuery('users', fetchUsers);
  const { purposes, isLoading: isLoadingPurposes } = useArticlePermissions();

  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usersPermissions, setUsersPermissions] = useState(null);

  const toggleModal = user => {
    const userWithPermissions = usersPermissions.find(up => up.user._id === user._id);
    setCurrentUser(userWithPermissions);
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (!users || !purposes) return;
    const perms = users.map(user => {
      return {
        user,
        canReadPermissions:
          purposes?.filter(purpose => purpose.canReadMembers.includes(user._id.toString())).map(p => p.name) || [],
        canWritePermissions:
          purposes?.filter(purpose => purpose.canWriteMembers.includes(user._id.toString())).map(p => p.name) || []
      };
    });
    setUsersPermissions(perms);
  }, [isLoadingUsers, isLoadingPurposes]);

  if (isLoadingUsers || isLoadingPurposes) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <List>
        {usersPermissions &&
          usersPermissions.map(up => (
            <ListItem key={up.user._id}>
              <ListItemText primary={up.user.username} secondary={`Permissions: ${up.canReadPermissions.join(', ')}`} />
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
            purposes={purposes}
            userPermissions={currentUser}
            setUsersPermissions={setUsersPermissions}
            setUser={setCurrentUser}
            closeModal={() => setOpenModal(false)}
          />
        </div>
      </Modal>
    </Container>
  );
};

export default Admin;
