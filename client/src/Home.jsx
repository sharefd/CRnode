import { Box, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userState } from './appState';

const Home = () => {
  const user = useRecoilValue(userState);

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
};

export default Home;
