import CloudLogo from '@/assets/images/logo.png';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/' className='flex items-center'>
      <img src={CloudLogo} width='64px' alt='CloudRounds Logo' />
    </Link>
  );
};
export default Logo;
