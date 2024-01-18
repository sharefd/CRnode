import { Row, Col } from 'antd';
import { SvgIcon } from '../../common/SvgIcon';
import Container from '../../common/Container';

import { FooterSection, Title, NavLink, Extra, LogoContainer, Para, Large, Chat, FooterContainer } from './styles';
import Logo from '../Logo';

const Footer = () => {
  const SocialLink = ({ href, src }) => {
    return (
      <a href={href} target='_blank' rel='noopener noreferrer' key={src} aria-label={src}>
        <SvgIcon src={src} width='25px' height='25px' />
      </a>
    );
  };

  return (
    <>
      <FooterSection>
        <Container>
          <Row justify='space-between'>
          </Row>
          <Row justify='space-between'>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>Company</Title>
              <Large to=''>About</Large>
            </Col>
            <Col lg={10} md={10} sm={12} xs={12}>
              <Title>Contact</Title>
              <a href='mailto:outreach@cloudrounds.com'>
                <Chat>Let's Chat</Chat>
              </a>
            </Col>
          </Row>
        </Container>
      </FooterSection>
      <hr style={{ width: '100%', border: '0', borderTop: '1px solid #CDD1D4' }} />
      <Extra>
        <Container border={true}>
          <Row justify='space-between' align='middle' style={{ paddingTop: '3rem' }}>
            <Logo />
            <FooterContainer>
              {/*  <SocialLink href='https://github.com/sharefd/CRnode' src='github.svg' /> */}
             <SocialLink href='https://twitter.com/cloudrounds' src='twitter.svg' />
               {/*  <SocialLink href='https://www.linkedin.com/in/sharefdanho/' src='linkedin.svg' /> */}
                {/*   <a href='https://ko-fi.com' target='_blank' rel='noopener noreferrer'>
                <img
                  height='36'
                  style={{ border: 0, height: 36 }}
                  src='https://storage.ko-fi.com/cdn/kofi3.png?v=3'
                  alt='Buy Me a Coffee at ko-fi.com'
                /> 
              </a> */}
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default Footer;
