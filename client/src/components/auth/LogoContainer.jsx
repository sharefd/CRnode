import CloudLogo from '@/assets/images/logo.png';

const LogoContainer = () => {
  return (
    <>
      {/* Left Column (Hidden on Mobile) */}
      <div className='w-full md:w-1/2 bg-blue-950 p-8 flex-col justify-center items-center text-white md:rounded-l-2xl hidden md:flex'>
        <img src={CloudLogo} width={120} alt='App Logo' className='mb-4' />
        <h1 className='text-4xl mb-4 text-center'>Welcome to CloudRounds</h1>
        <p className='text-center '>
          CloudRounds is an app for learners, researchers, health professionals, and others to easily create, manage,
          and view medical rounds, research meetings, webinars, and similar events.{' '}
        </p>
      </div>

      {/* Small Screen Welcome Div */}
      <div className='w-full bg-blue-950 p-4 text-white text-center md:hidden'>
        <div>
          <img src={CloudLogo} width={20} alt='App Logo' className='ml-2' />

          <p className='text-s mb-2'>Welcome to CloudRounds.</p>
        </div>
        <p className='text-xs'>Create, manage, and view your events in a more intuitive and collaborative way.</p>
      </div>
    </>
  );
};
export default LogoContainer;
