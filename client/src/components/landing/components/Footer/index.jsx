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
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>Policy</Title>
              <Large to='/'>Application Security</Large>
              <Large to='/'>Software Principles</Large>
            </Col>
            <Col lg={10} md={10} sm={12} xs={12}>
              <Title>Support</Title>
              <Large to='/'>Support Center</Large>
              <Large to='/'>Customer Support</Large>
            </Col>
          </Row>
          <Row justify='space-between'>
            <Col lg={8} md={8} sm={12} xs={12}>
              <Title>Company</Title>
              <Large to='/'>About</Large>
              <Large to='/'>Blog</Large>
              <Large to='/'>Press</Large>
              <Large to='/'>Careers & Culture</Large>
            </Col>
            <Col lg={10} md={10} sm={12} xs={12}>
              <Title>Contact</Title>
              <Large to='/'>Tell us everything</Large>
              <Para>Do you have any question? Feel free to reach out.</Para>
              <a href='mailto:l.qqbadze@gmail.com'>
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
            <NavLink to='/'>
              <Logo />
            </NavLink>
            <FooterContainer>
              <SocialLink href='https://github.com/sharefd/CRnode' src='github.svg' />
              {/* <SocialLink href='https://twitter.com/' src='twitter.svg' /> */}
              <SocialLink href='https://www.linkedin.com/in/sharefdanho/' src='linkedin.svg' />
              <a href='https://ko-fi.com' target='_blank' rel='noopener noreferrer'>
                <img
                  height='36'
                  style={{ border: 0, height: 36 }}
                  src='https://storage.ko-fi.com/cdn/kofi3.png?v=3'
                  alt='Buy Me a Coffee at ko-fi.com'
                />
              </a>
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default Footer;
