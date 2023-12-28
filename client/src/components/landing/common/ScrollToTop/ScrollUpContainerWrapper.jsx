import styled from 'styled-components';

const ScrollUpContainerWrapper = ({ show, ...props }) => {
  const visibility = show ? 'visible' : 'hidden';
  const opacity = show ? '1' : '0';

  return <ScrollUpContainer style={{ visibility, opacity }} {...props} />;
};

export const ScrollUpContainer = styled('div')`
  padding: 10px;
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 10;
  cursor: pointer;
  background: rgb(241, 242, 243);
  text-align: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  display: flex;

  &:hover,
  &:active,
  &:focus {
    background: rgb(224, 224, 224);
  }

  @media screen and (max-width: 1240px) {
    display: none;
  }
`;

export default ScrollUpContainerWrapper;
