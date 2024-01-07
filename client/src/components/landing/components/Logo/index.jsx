import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/' className='flex items-center'>
      <img src='img/svg/logo.png' width='64px' alt='CloudRounds Logo' />
      <h4 style={{ marginLeft: '10px' }}>CloudRounds</h4>
    </Link>
  );
};
export default Logo;
