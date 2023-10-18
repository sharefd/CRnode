import { Paper, Typography } from '@mui/material';

const AccessDenied = () => {
  return (
    <Paper sx={{ width: '80%', margin: '0 auto', mt: 5, textAlign: 'center', padding: '2rem' }}>
      <Typography variant='h5'>Access Denied</Typography>
      <Typography variant='subtitle1'>Sorry, you do not have permission to view this page.</Typography>
    </Paper>
  );
};

export default AccessDenied;
