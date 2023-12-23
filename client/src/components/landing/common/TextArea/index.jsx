import { StyledTextArea, StyledContainer, Label } from './styles';

const TextArea = ({ name, placeholder, onChange }) => (
  <StyledContainer>
    <Label htmlFor={name}>{name}</Label>
    <StyledTextArea placeholder={placeholder} id={name} name={name} onChange={onChange} />
  </StyledContainer>
);

export default TextArea;
