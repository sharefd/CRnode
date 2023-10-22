import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, MenuItem, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { initialPermissions, UNIVERSITY_CHOICES } from '@/utils/authForm';

const AuthForm = observer(() => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    university: '',
    password: '',
    passwordConfirmation: '',
    isAdmin: false,
    firstName: '',
    lastName: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    university: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: ''
  });

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    const fieldsToCheck = isSignup
      ? ['firstName', 'lastName', 'username', 'email', 'university', 'password', 'passwordConfirmation']
      : ['username', 'password'];

    fieldsToCheck.forEach(key => {
      if (!credentials[key]) {
        isValid = false;
        setError('Please fill in all required fields.');

        errors[key] = 'This field is required';
      }
    });

    if (isSignup && credentials.password !== credentials.passwordConfirmation) {
      isValid = false;
      errors.passwordConfirmation = 'Passwords do not match';
      setError('Passwords do not match');
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (isSignup) {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, {
          ...credentials,
          permissions: initialPermissions
        });

        if (response.status === 200) {
          setMessage('Successfully signed up');
          userStore.setUser(response.data.user);
          setTimeout(() => {
            setIsSignup(false);
            setIsLoading(false);
            setMessage(null);
          }, 2000);
        }
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
          username: credentials.username,
          password: credentials.password
        });

        if (response.status === 200) {
          setMessage('Successfully logged in');
          userStore.setUser(response.data.user);
          localStorage.setItem('CloudRoundsToken', response.data.token);

          const feedbackResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/feedbacks/${response.data.user._id}`
          );

          userStore.setFeedbacks(feedbackResponse.data);

          setTimeout(() => {
            setIsLoading(false);
            navigate('/');
          }, 1500);
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data);
      setIsLoading(false);
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  const gridFormItem = (label, value, onChange, fieldName, type = 'text', choices) => (
    <Grid item xs={12}>
      {type === 'select' ? (
        <TextField label={label} select fullWidth value={value} onChange={onChange} error={!!fieldErrors[fieldName]}>
          {choices.map((choice, index) => (
            <MenuItem key={index} value={choice.label}>
              {choice.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          label={label}
          type={type}
          fullWidth
          value={value}
          onChange={onChange}
          error={!!fieldErrors[fieldName]}
        />
      )}
    </Grid>
  );

  const gridErrorMessage = errorMessage => (
    <Grid item xs={12} sx={{ ml: 1, mb: 3 }}>
      <Typography variant='caption' color='error'>
        {errorMessage}
      </Typography>
    </Grid>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} sx={{ padding: 4, width: '50%', margin: '0 auto', mt: 8 }}>
        <Typography variant='h5' align='center' sx={{ backgroundColor: '#f1f8ff', padding: '0.6rem', mb: 4 }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        {error && gridErrorMessage(error)}
        {message === 'Successfully signed up' || message === 'Successfully logged in' ? (
          <Grid container direction='column' spacing={2} alignItems='center' sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant='h6'>{message}</Typography>
            </Grid>
            {isLoading && (
              <Grid item>
                <CircularProgress size={24} />
              </Grid>
            )}
          </Grid>
        ) : (
          <>
            <Grid container spacing={3}>
              {isSignup ? (
                <>
                  {gridFormItem(
                    'First Name',
                    credentials.firstName,
                    e => setCredentials({ ...credentials, firstName: e.target.value }),
                    'firstName'
                  )}
                  {gridFormItem(
                    'Last Name',
                    credentials.lastName,
                    e => setCredentials({ ...credentials, lastName: e.target.value }),
                    'lastName'
                  )}
                  {gridFormItem(
                    'Username',
                    credentials.username,
                    e => setCredentials({ ...credentials, username: e.target.value }),
                    'username'
                  )}
                  {gridFormItem(
                    'Email',
                    credentials.email,
                    e => setCredentials({ ...credentials, email: e.target.value }),
                    'email'
                  )}
                  {gridFormItem(
                    'University',
                    credentials.university,
                    e => setCredentials({ ...credentials, university: e.target.value }),
                    'university',
                    'select',
                    UNIVERSITY_CHOICES
                  )}
                  {gridFormItem(
                    'Password',
                    credentials.password,
                    e => setCredentials({ ...credentials, password: e.target.value }),
                    'password',
                    'password'
                  )}
                  {gridFormItem(
                    'Password Confirmation',
                    credentials.passwordConfirmation,
                    e => setCredentials({ ...credentials, passwordConfirmation: e.target.value }),
                    'passwordConfirmation',
                    'password'
                  )}
                </>
              ) : (
                <>
                  {gridFormItem(
                    'Username',
                    credentials.username,
                    e => setCredentials({ ...credentials, username: e.target.value }),
                    'username'
                  )}
                  {gridFormItem(
                    'Password',
                    credentials.password,
                    e => setCredentials({ ...credentials, password: e.target.value }),
                    'password',
                    'password'
                  )}
                </>
              )}
            </Grid>

            <Grid container direction='column' spacing={2} alignItems='center' sx={{ mt: 2 }}>
              <Grid item>
                <Button type='submit' variant='contained' color='primary'>
                  {isSignup ? 'Sign Up' : 'Login'}
                </Button>
                {isLoading && <CircularProgress size={24} />}
              </Grid>
              <Grid item>
                <Button onClick={toggleSignup}>{isSignup ? 'Switch to Login' : 'Switch to Signup'}</Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </form>
  );
});

export default AuthForm;
