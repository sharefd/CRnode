import { useState } from 'react';
import { TextField, Button, MenuItem, Paper, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PURPOSE_CHOICES, YEAR_OF_STUDY_CHOICES } from '../utils/constants';
import { useRecoilValue } from 'recoil';
import { userState } from '../appState';


const NewRequest = () => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [message, setMessage] = useState('');
  const user = useRecoilValue(userState);

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(user);
    const data = { purpose, year_of_study: yearOfStudy, message, user: user._id, email: user.email };

    axios
      .post('http://localhost:3001/api/requests/new', data)
      .then(response => {
        console.log('Request created:', response.data);
        navigate('/requests/submitted');
      })
      .catch(error => {
        console.error('There was an error creating the request:', error);
      });
  };

  return (
    <Paper elevation={3} sx={{ width: '40%', margin: '0 auto', mt: 8 }}>
      <Grid item xs={12}>
        <Typography
          variant='h5'
          align='center'
          sx={{
            backgroundColor: '#0066b2',
            color: '#fff',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px',
            padding: '1rem',
            mb: 2
          }}>
          Submit Request
        </Typography>
      </Grid>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3} sx={{ padding: 4 }}>
          <Grid item xs={8}>
            <TextField select label='Purpose' required fullWidth value={purpose} onChange={e => setPurpose(e.target.value)}>
              {Object.keys(PURPOSE_CHOICES).map((key, index) => (
                <MenuItem key={index} value={key}>
                  {PURPOSE_CHOICES[key]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              select
              label='Level'
              variant='outlined'
              value={yearOfStudy}
              onChange={e => setYearOfStudy(e.target.value)}>
              {YEAR_OF_STUDY_CHOICES.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label='Message (optional)'
              variant='outlined'
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button type='submit' variant='contained' color='primary' style={{ marginBottom: '10px' }}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant='outlined' color='primary' onClick={() => navigate('/requests/submitted')}>
              View Submitted Requests
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewRequest;
