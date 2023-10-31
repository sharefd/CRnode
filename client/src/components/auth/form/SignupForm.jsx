import { createUser } from '@/services/users';
import userStore from '@/stores/userStore';
import { CircularProgress, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ChevronLeft from '../buttons/ChevronLeft';
import ContinueWithEmail from '../buttons/ContinueWithEmail';
import GoogleButton from '../buttons/GoogleButton';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';

const SignupForm = observer(({ fields, setIsSignUp }) => {
  const navigate = useNavigate();
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
    try {
      const user = await createUser(credentials);

      console.log(user);

      setTimeout(() => {
        setIsLoading(false);
        setCredentials(initialCredentials);
        setIsSignUp(false);
        toast.success('Successfully signed up', { autoClose: 1500, pauseOnFocusLoss: false });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data, {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
      setIsLoading(false);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const errors = {};

    const fieldsToCheck = [
      'firstName',
      'lastName',
      'username',
      'email',
      'university',
      'password',
      'passwordConfirmation'
    ];

    fieldsToCheck.forEach(key => {
      if (!credentials[key]) {
        isValid = false;
        toast.error('Please fill in all required fields.', {
          autoClose: 2500,
          pauseOnFocusLoss: false
        });

        errors[key] = 'This field is required';
      }
    });

    if (credentials.password !== credentials.passwordConfirmation) {
      isValid = false;
      errors.passwordConfirmation = 'Passwords do not match';
      toast.error('Passwords do not match', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
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
              <div className='mt-8 w-full text-center'>
                {isLoading && (
                  <div className='w-full text-center'>
                    <CircularProgress size={24} />
                  </div>
                )}
                <div className='pb-4 sm:pb-8 text-center w-full'>
                  {!isLoading && (
                    <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded-full hover:bg-blue-400'>
                      Sign Up
                    </button>
                  )}
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
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => setIsSignUp(false)}>
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
