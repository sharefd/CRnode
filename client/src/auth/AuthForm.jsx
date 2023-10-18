import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, MenuItem, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { userState } from '../appState';

const AuthForm = () => {
  const [user, setUser] = useRecoilState(userState);

  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const initialPermissions = Object.keys(PURPOSE_CHOICES).map(purpose => ({
    purpose,
    canRead: false,
    canWrite: false
  }));

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    university: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false
  });

  const UNIVERSITY_CHOICES = [
    { value: '', label: 'Select University' },
    { value: 'McMaster', label: 'McMaster University' },
    { value: 'Toronto', label: 'University of Toronto' },
    { value: 'Western', label: 'University of Western Ontario' },
    { value: 'Ottawa', label: 'Ottawa University' },
    { value: 'Queens', label: "Queen's University" },
    { value: 'Other', label: 'Other' }
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let response;
      if (isSignup) {
        response = await axios.post('http://localhost:3001/api/users/register', {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          university: credentials.university,
          isAdmin: credentials.isAdmin,
          permissions: initialPermissions
        });

        if (response.status === 200) {
          setMessage('Successfully signed up');
          setUser(response.data.user);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        response = await axios.post('http://localhost:3001/api/users/login', {
          username: credentials.username,
          password: credentials.password
        });

        if (response.status === 200) {
          setMessage('Successfully logged in');
          setUser(response.data.user);
          localStorage.setItem('CloudRoundsToken', response.data.token);
          navigate('/');
        }
      }
    } catch (error) {
      setMessage(`Error: ${error.response.data.message}`);
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  const gridFormItem = (label, value, onChange, type = 'text', choices) => (
    <Grid item xs={12}>
      {type === 'select' ? (
        <TextField label={label} select fullWidth value={value} onChange={onChange}>
          {choices.map((choice, index) => (
            <MenuItem key={index} value={choice.label}>
              {choice.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField label={label} type={type} fullWidth value={value} onChange={onChange} />
      )}
    </Grid>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ padding: 4, width: '50%', margin: '0 auto', mt: 8 }}>
        <Typography variant='h5' align='center' sx={{ backgroundColor: '#f1f8ff', padding: '0.6rem', mb: 4 }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <Grid container spacing={3}>
          {isSignup ? (
            <>
              {gridFormItem('Username', credentials.username, e =>
                setCredentials({ ...credentials, username: e.target.value })
              )}
              {gridFormItem('Email', credentials.email, e => setCredentials({ ...credentials, email: e.target.value }))}
              {gridFormItem(
                'University',
                credentials.university,
                e => setCredentials({ ...credentials, university: e.target.value }),
                'select',
                UNIVERSITY_CHOICES
              )}
              {gridFormItem(
                'Password',
                credentials.password,
                e => setCredentials({ ...credentials, password: e.target.value }),
                'password'
              )}
              {gridFormItem(
                'Password Confirmation',
                credentials.passwordConfirmation,
                e => setCredentials({ ...credentials, passwordConfirmation: e.target.value }),
                'password'
              )}
            </>
          ) : (
            <>
              {gridFormItem('Username', credentials.username, e =>
                setCredentials({ ...credentials, username: e.target.value })
              )}
              {gridFormItem(
                'Password',
                credentials.password,
                e => setCredentials({ ...credentials, password: e.target.value }),
                'password'
              )}
            </>
          )}
        </Grid>
        {message && (
          <Typography variant='body2' color='textSecondary'>
            {message}
          </Typography>
        )}
        <Grid container direction='column' spacing={2} alignItems='center' sx={{ mt: 2 }}>
          <Grid item>
            <Button type='submit' variant='contained' color='primary'>
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={toggleSignup}>{isSignup ? 'Switch to Login' : 'Switch to Signup'}</Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default AuthForm;
