import { Row, Col } from 'antd';
import { Slide } from 'react-awesome-reveal';
import { Button } from '../../common/Button';
import { MiddleBlockSection, Content, ContentWrapper } from './styles';

const MiddleBlock = ({ title, content, button }) => {
  const scrollTo = id => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return (
    <MiddleBlockSection>
      <Slide direction='up' triggerOnce>
        <Row justify='center' align='middle'>
          <ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h1>{title}</h1>
              <Content>{content}</Content>
              {button && (
                <Button name='submit' onClick={() => scrollTo('mission')}>
                  {button}
                </Button>
              )}
            </Col>
          </ContentWrapper>
        </Row>
      </Slide>
    </MiddleBlockSection>
  );
};

export default MiddleBlock;
