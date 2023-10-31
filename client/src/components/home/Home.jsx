import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchPurposes, getCanReadPermissions, getCanWritePermissions } from '@/services/purposes';
import userStore from '@/stores/userStore';
import EventAvailable from '@mui/icons-material/EventAvailable';
import History from '@mui/icons-material/History';
import ManageSearch from '@mui/icons-material/ManageSearch';
import Key from '@mui/icons-material/VpnKey';
import { Box, Grid, Link, Paper, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

const navlinks = [
  {
    label: 'Manage Requests',
    Icon: Key,
    endpoint: '/requests',
    description: 'View and manage incoming permission requests.'
  },
  {
    label: 'My Rounds',
    Icon: EventAvailable,
    endpoint: '/articles',
    description: 'Access your articles and events. Includes a calendar view.'
  },
  {
    label: 'Past Rounds',
    Icon: History,
    endpoint: '/older-articles',
    description: 'Review past articles and provide optional feedback.'
  },
  {
    label: 'Rounds Catalog',
    Icon: ManageSearch,
    endpoint: '/requests/new',
    description: 'Explore public events and request access.'
  }
];

const Home = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const {
    data: purposes,
    isLoading,
    refetch
  } = useQuery(['userPurposes', user._id], () => fetchPurposes(user._id), {
    enabled: !!user._id
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    userStore.setUser(user);

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
          <Typography>To get started, click Rounds Catalog and request access to rounds.</Typography>
          <Grid container spacing={2} sx={{ mt: 4, px: 8 }}>
            {navlinks.map((navlink, index) => (
              <Grid key={index} item xs={6}>
                <Link href={navlink.endpoint} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: '16px',
                      textAlign: 'center',
                      transition: 'background-color 0.3s',
                      '&:hover': { backgroundColor: '#EBF5FB' }
                    }}>
                    <navlink.Icon fontSize='large' />
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
