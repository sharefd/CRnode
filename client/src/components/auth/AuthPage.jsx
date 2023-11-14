import { useEffect, useState } from 'react';
import LoginForm from './form/LoginForm';
import SignupForm from './form/SignupForm';
import { loginFields, signupFields } from './fields/authFields';
import { useLocation } from 'react-router-dom';
import LogoContainer from './LogoContainer';

const AuthPage = () => {
  const location = useLocation();
  const [isSignup, setIsSignUp] = useState(location.pathname === '/register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const appName = 'CloudRounds';

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  const formContainerClass = isSignup
    ? 'flex flex-col justify-start md:justify-center h-[85vh]'
    : 'flex flex-col justify-center h-[85vh]';

  return (
    <div className='flex justify-center items-center h-screen pb-10 auth'>
      <div className='flex flex-col md:flex-row w-full max-w-screen-lg h-[85vh]'>
        {/* Left Column */}
        <LogoContainer />

        {/* Right Column */}
        <div
          className={`w-full md:w-1/2 p-8 ${formContainerClass} bg-white relative overflow-y-auto md:rounded-r-2xl`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {isSignup ? (
            <SignupForm fields={signupFields} setIsSignUp={setIsSignUp} />
          ) : (
            <LoginForm
              fields={loginFields}
              appName={appName}
              isForgotPassword={isForgotPassword}
              setIsForgotPassword={setIsForgotPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
