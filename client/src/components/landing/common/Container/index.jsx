import { StyledContainer } from './styles';

const Container = ({ border, children }) => <StyledContainer shouldHaveBorder={border}>{children}</StyledContainer>;

export default Container;
