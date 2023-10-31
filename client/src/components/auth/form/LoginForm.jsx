import { useState } from 'react';
import InputField from '../fields/InputField';
import GoogleButton from '../buttons/GoogleButton';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { fetchPurposes } from '@/services/purposes';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
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

    const response = await loginUser(credentials.username, credentials.password);
    userStore.setUser(response.user);
    localStorage.setItem('CloudRoundsToken', response.token);
    localStorage.setItem('CloudRoundsUser', JSON.stringify(response.user));

    const feedbacks = await fetchUserFeedbacks(response.user._id);
    userStore.setFeedbacks(feedbacks);

    setTimeout(() => {
      setIsLoading(false);
      toast.success('Successfully logged in', { autoClose: 1500, pauseOnFocusLoss: false });
      navigate('/');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='scrollable-area'>
        <div>
          <GoogleButton isSignup={false} />
        </div>
        <div className='px-8 py-2 w-full mx-auto pt-4'>
          <hr className='divider sign-in' />
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
                <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded-full hover:bg-blue-400'>
                  Login
                </button>
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
