import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will have no visible UI. Its only job is to run an effect.
const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This effect runs every time the `pathname` changes (i.e., on every route navigation).
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Render nothing
};

export default ScrollToTop;