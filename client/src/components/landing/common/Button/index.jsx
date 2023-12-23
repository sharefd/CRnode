import { StyledButton } from './styles';

export const Button = ({ color, children, onClick }) => (
  <StyledButton color={color} onClick={onClick}>
    {children}
  </StyledButton>
);
