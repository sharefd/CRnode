import { useState } from 'react';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';
import GoogleButton from '../buttons/GoogleButton';
import ContinueWithEmail from '../buttons/ContinueWithEmail';
import ChevronLeft from '../buttons/ChevronLeft';
import userStore from '@/stores/userStore';
import { createUser, loginUser } from '@/services/users';
import { fetchUserPermissions, initPermissions } from '@/services/permissions';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { Grid, CircularProgress } from '@mui/material';

const SignupForm = observer(({ fields, setIsSignup }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const initialCredentials = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [credentials, setCredentials] = useState(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState(initialCredentials);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (isSignup) {
        const user = await createUser(credentials);

        setMessage('Successfully signed up');
        userStore.setUser(user);
        console.log(user);
        await initPermissions(user._id);

        setTimeout(() => {
          setIsSignup(false);
          setIsLoading(false);
          setMessage(null);
        }, 1500);
      } else {
        const response = await loginUser(credentials.username, credentials.password);
        setMessage('Successfully logged in');
        userStore.setUser(response.user);
        localStorage.setItem('CloudRoundsToken', response.token);

        const feedbacks = await fetchUserFeedbacks(response.user._id);
        userStore.setFeedbacks(feedbacks);

        try {
          await fetchUserPermissions(response.user._id);
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }

        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data);
      setIsLoading(false);
    }
  };

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

  return (
    <form onSubmit={handleSubmit}>
      <div className='p-8 w-full mx-auto mt-8 pt-4'>
        {showForm ? (
          <>
            <ChevronLeft setShowForm={setShowForm} />
            <div className='scrollable-area'>
              <h1 className='text-center text-2xl mb-4'>Sign Up</h1>
              {error && <p className='text-red-500 text-sm ml-1 mb-3'>{error}</p>}
              {fields.map((field, index) => {
                const FieldComponent = field.type === 'select' ? SelectField : InputField;

                return (
                  <FieldComponent
                    key={index}
                    field={field}
                    value={credentials[field.name]}
                    onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                    error={fieldErrors[field.name]}
                  />
                );
              })}
              <div className='flex justify-center mt-8'>
                {isLoading && (
                  <Grid item>
                    <CircularProgress size={24} />
                  </Grid>
                )}
                <div className='pb-4 sm:pb-8 w-full text-center'>
                  <button type='submit' className='w-1/2 bg-blue-500 text-white p-2 rounded-full'>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <GoogleButton isSignup={true} />
            <hr className='divider' />
            <ContinueWithEmail showForm={showForm} setShowForm={setShowForm} />
            <p className='mt-8 text-center'>
              Already have an account?{' '}
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => setIsSignup(false)}>
                Log in
              </span>
            </p>
          </>
        )}
      </div>
    </form>
  );
});

export default SignupForm;
