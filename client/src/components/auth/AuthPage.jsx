import { useEffect, useState } from 'react';
import LoginForm from './form/LoginForm';
import SignupForm from './form/SignupForm';
import { loginFields, signupFields } from './fields/authFields';
import CloudLogo from '@/assets/images/logo.png';
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
  const location = useLocation();
  const [isSignup, setIsSignUp] = useState(location.pathname === '/register');
  const appName = 'CloudRounds';

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  return (
    <div className='flex justify-center items-center h-screen pb-20 auth'>
      <div className='flex flex-col md:flex-row w-full max-w-screen-lg h-[80vh]'>
        {/* Left Column (Hidden on Mobile) */}
        <div className='w-full md:w-1/2 bg-slate-700 p-8 flex-col justify-center items-center text-white md:rounded-l-2xl hidden md:flex'>
          <img src={CloudLogo} width={120} alt='App Logo' className='mb-4' />
          <h1 className='text-4xl mb-4 text-center'>Welcome to {appName}</h1>
          <p></p>
        </div>

        {/* Right Column */}
        <div
          className='w-full md:w-1/2 p-8 flex flex-col justify-center h-[80vh] bg-white relative overflow-y-auto md:rounded-r-2xl'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {isSignup ? (
            <SignupForm fields={signupFields} setIsSignUp={setIsSignUp} appName={appName} />
          ) : (
            <LoginForm fields={loginFields} setIsSignUp={setIsSignUp} appName={appName} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
