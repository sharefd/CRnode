import { Button, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessMessage = () => {
  const navigate = useNavigate();

  return (
    <Paper elevation={3} sx={{ width: '40%', margin: '0 auto', mt: 8, padding: 4 }}>
      <Typography variant='h6' align='center'>
        Request Successfully Submitted!
      </Typography>
      <Grid container spacing={3} sx={{ textAlign: 'center', mt: 2 }}>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={() => navigate('/requests/new')}>
            Submit a New Request
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant='outlined' color='primary' onClick={() => navigate('/articles')}>
            View Articles
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SuccessMessage;
