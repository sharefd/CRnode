import CloudLogo from '@/assets/images/logo.png';

const LogoContainer = ({ isSignup }) => {
  const welcomeMessage = isSignup
    ? 'Join our community of learners and health professionals.'
    : 'Access and manage your   medical rounds and research meetings.';

  return (
    <>
      {/* Desktop View */}
      <div className='logo-container-desktop'>
        <img src={CloudLogo} alt='App Logo' />
        <h1>Welcome to CloudRounds</h1>
        <p>{welcomeMessage}</p>
      </div>

      {/* Mobile View */}
      <div className='logo-container-mobile'>
        <img src={CloudLogo} alt='App Logo' />
          <p className='ml-4'>
    Welcome to CloudRounds.
    <br />
    <span style={{ fontSize: '0.7em' }}>
      Access and manage your medical rounds and research meetings.
    </span>
  </p>
          
      </div>
    </>
  );
};
export default LogoContainer;
