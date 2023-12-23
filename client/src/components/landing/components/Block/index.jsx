import { Container, TextWrapper, Content } from './styles';

const Block = ({ title, content }) => {
  return (
    <Container>
      <h6>{title}</h6>
      <TextWrapper>
        <Content>{content}</Content>
      </TextWrapper>
    </Container>
  );
};

export default Block;
