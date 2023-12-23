import { withTranslation } from 'react-i18next';
import { Container, TextWrapper, Content } from './styles';

const Block = ({ title, content, t }) => {
  return (
    <Container>
      <h6>{t(title)}</h6>
      <TextWrapper>
        <Content>{t(content)}</Content>
      </TextWrapper>
    </Container>
  );
};

export default withTranslation()(Block);
