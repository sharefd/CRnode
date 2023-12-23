import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/' className='flex items-center'>
      <img src='img/svg/logo.png' width='64px' alt='CloudRounds Logo' />
    </Link>
  );
};
export default Logo;
