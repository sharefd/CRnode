import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../common/Button';
import Container from '../../common/Container';
import Logo from '../Logo';
import { CustomNavLinkSmall, HeaderSection, Span } from './styles';

const Header = () => {
  const navigate = useNavigate();
  const [visible, setVisibility] = useState(false);
  const [username, setUsername] = useState(null);
  const token = localStorage.getItem('CloudRoundsToken');

  useEffect(() => {
    const localUser = localStorage.getItem('CloudRoundsUser');
    if (localUser) {
      const parsedUsername = JSON.parse(localUser);
      if (parsedUsername.username) {
        setUsername(parsedUsername.username);
      }
    }
  }, []);

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    const scrollTo = id => {
      const element = document.getElementById(id);
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setVisibility(false);
    };
    return (
      <>
        {/* <CustomNavLinkSmall onClick={() => scrollTo('about')}>
          <Span>About</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo('mission')}> 
          <Span>Mission</Span> 
        </CustomNavLinkSmall>  
        <CustomNavLinkSmall onClick={() => scrollTo('product')}>
          <Span>Product</Span>
        </CustomNavLinkSmall> */}
        <CustomNavLinkSmall style={{ width: '180px' }} onClick={() => navigate(token ? '/calendar' : '/login')}>
          <Span>
            <Button>{token ? `Dashboard` : 'Sign Up/Log In'}</Button>
          </Span>
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify='space-between'>
          <Logo />
          {/* <NotHidden>
            <MenuItem />
          </NotHidden> */}
          <MenuItem /> {/* Render the button directly for mobile devices */}
        </Row>
      </Container>
    </HeaderSection>
  );
};

export default Header;
