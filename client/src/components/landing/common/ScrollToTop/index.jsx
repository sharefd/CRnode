import { useEffect, useState } from 'react';
import { SvgIcon } from '../SvgIcon';
import { getScroll } from '../utils/getWindow';
import ScrollUpContainerWrapper from './ScrollUpContainerWrapper';

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = event => {
    const offsetFromTop = getScroll(event.target, true);

    if (!showScroll && offsetFromTop > 350) {
      setShowScroll(true);
    } else if (offsetFromTop <= 350) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollUp = () => {
    const element = document.getElementById('intro');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };

  return (
    <ScrollUpContainerWrapper onClick={scrollUp} show={showScroll}>
      <SvgIcon src='scroll-top.svg' width='20px' height='20px' />
    </ScrollUpContainerWrapper>
  );
};

export default ScrollToTop;
