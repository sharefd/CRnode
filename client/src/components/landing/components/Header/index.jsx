import { useState } from 'react';
import { Row, Col, Drawer } from 'antd';
import Container from '../../common/Container';
import { SvgIcon } from '../../common/SvgIcon';
import { Button } from '../../common/Button';
import { HeaderSection, LogoContainer, CustomNavLinkSmall, Label, Span } from './styles';
import { useNavigate } from 'react-router';
import Logo from '../Logo';

const Header = () => {
  const navigate = useNavigate();
  const [visible, setVisibility] = useState(false);

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    const scrollTo = (id) => {
      const element = document.getElementById(id);
      element.scrollIntoView({
        behavior: 'smooth',
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
        <CustomNavLinkSmall style={{ width: '180px' }} onClick={() => navigate('/login')}>
          <Span>
            <Button>Sign Up/Log In</Button>
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
