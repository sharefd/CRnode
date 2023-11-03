import { useState } from 'react';
import InputField from '../fields/InputField';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { toast } from 'react-toastify';
import { CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { loginUser } from '@/services/users';

const LoginForm = observer(({ fields, setIsSignUp, appName }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const initialCredentials = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [credentials, setCredentials] = useState(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState(initialCredentials);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (!credentials.username || !credentials.password) {
      toast.error('Invalid or empty fields. Please enter a valid username and password.', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
      return;
    }

    try {
      const response = await loginUser(credentials.username, credentials.password);
      userStore.setUser(response.user);
      localStorage.setItem('CloudRoundsToken', response.token);
      localStorage.setItem('CloudRoundsUser', JSON.stringify(response.user));

      const feedbacks = await fetchUserFeedbacks(response.user._id);
      userStore.setFeedbacks(feedbacks);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className='scrollable-area'>
        <div className='px-8 py-2 w-full mx-auto pt-4'>
          <div style={{ marginTop: '30px', marginBottom: '30px' }}>
            {fields.map((field, index) => (
              <InputField
                key={index}
                field={field}
                value={credentials[field.name]}
                onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                error={fieldErrors[field.name]}
              />
            ))}
          </div>
          {isLoading && (
            <div className='flex w-full justify-center text-center'>
              <CircularProgress size={24} />
            </div>
          )}
          <div className='pb-4 sm:pb-8 w-full text-center'>
            <div className='flex justify-center mt-8'>
              {!isLoading && (
                <Typography
                  onClick={handleSubmit}
                  sx={{
                    cursor: 'pointer',
                    px: 2,
                    py: 1,
                    width: '100%',
                    color: '#fff',
                    backgroundColor: '#4185EF',
                    '&:hover': { backgroundColor: '#2e67d2' },
                    borderRadius: '9999px'
                  }}>
                  Login
                </Typography>
              )}
            </div>
            <p className='mt-8 text-center'>
              New to {appName}?{' '}
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => setIsSignUp(true)}>
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
});

export default LoginForm;
