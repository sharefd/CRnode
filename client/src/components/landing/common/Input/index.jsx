import { Container, StyledInput } from './styles';
import { Label } from '../TextArea/styles';

const Input = ({ name, placeholder, onChange }) => (
  <Container>
    <Label htmlFor={name}>{name}</Label>
    <StyledInput placeholder={placeholder} name={name} id={name} onChange={onChange} />
  </Container>
);

export default Input;
