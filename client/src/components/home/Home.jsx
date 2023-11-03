import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchPurposes, getCanReadPermissions, getCanWritePermissions } from '@/services/purposes';
import userStore from '@/stores/userStore';
import { navlinks } from '@/utils/constants';
import { Box, Grid, Link, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

const localUser = localStorage.getItem('CloudRoundsUser');
const user = JSON.parse(localUser);

const Home = observer(() => {
  const navigate = useNavigate();

  const { data: purposes, isLoading } = useQuery(['userPurposes', user?._id], () => fetchPurposes(user?._id), {
    enabled: !!user?._id
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user || localUser === undefined) {
      navigate('/login');
      return;
    }

    const canReadPurposes = getCanReadPermissions(purposes, user._id).map(p => p.name);
    userStore.setCanRead(canReadPurposes);

    const canWritePurposes = getCanWritePermissions(purposes, user._id).map(p => p.name);
    userStore.setCanWrite(canWritePurposes);
  }, [isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ ml: 4, mt: 4 }}>
      {user ? (
        <>
          <Typography variant='h6'>Welcome, {user ? user.firstName : 'None'}.</Typography>
          <Typography>To get started, navigate to My Calendar and create an event. </Typography>
          <Grid container spacing={2} sx={{ mt: 4, px: 8 }}>
            {navlinks.map((navlink, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Link href={navlink.endpoint} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={3}
                    sx={{
                      width: '100%',
                      height: '150px',
                      padding: '16px',
                      textAlign: 'center',
                      transition: 'background-color 0.3s',
                      '&:hover': { backgroundColor: '#EBF5FB' }
                    }}>
                    <div className='flex justify-center mb-2'>
                      {!navlink.type && <navlink.Icon fontSize='large' />}
                      {navlink.type && <navlink.Icon size={28} />}
                    </div>
                    <Typography variant='subtitle1'>{navlink.label}</Typography>
                    <Typography variant='body2' style={{ marginTop: '8px' }}>
                      {navlink.description}
                    </Typography>{' '}
                    {/* Updated styling */}
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
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
