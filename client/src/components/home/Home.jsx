import { Box, Typography } from '@mui/material';
import userStore from '@/stores/userStore';
import { observer } from 'mobx-react';

const Home = observer(() => {
  const user = userStore.user;

  return (
    <Box sx={{ ml: 4, mt: 4 }}>
      {user ? (
        <>
          <Typography variant='h6'>Welcome {user ? user.username : 'None'}.</Typography>
          <Typography>To get started, click Rounds Catalog and request access to rounds.</Typography>
        </>
      ) : (
        <Typography variant='h6' sx={{ color: 'gray' }}>
          You are not logged in.
        </Typography>
      )}
    </Box>
  );
});

export default Home;
