import { useEffect, useState } from 'react';
import LoginForm from './form/LoginForm';
import SignupForm from './form/SignupForm';
import { loginFields, signupFields } from './fields/authFields';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoContainer from './LogoContainer';

const AuthPage = () => {
  const location = useLocation();
  const [isSignup, setIsSignUp] = useState(location.pathname === '/register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const appName = 'CloudRounds';

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  // useEffect(() => {
  //   const localUser = localStorage.getItem('CloudRoundsUser');
  //   const token = localStorage.getItem
  //   if (localUser) {
  //     const parsedUser = JSON.parse(localUser);
  //     if (!parsedUser) {
  //       navigate('/');
  //     }
  //   }
  // }, []);
  return (
    <div className='auth-container'>
      <LogoContainer />

      <div className='form-container'>
        {isSignup ? (
          <SignupForm fields={signupFields} setIsSignUp={setIsSignUp} />
        ) : (
          <LoginForm
            fields={loginFields}
            isForgotPassword={isForgotPassword}
            setIsForgotPassword={setIsForgotPassword}
            appName={appName}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
