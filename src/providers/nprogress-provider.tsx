import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

interface NProgressProviderProps {
  children: React.ReactNode;
}

export function NProgressProvider({ children }: NProgressProviderProps) {
  const location = useLocation();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.1,
    });

    return () => {
      NProgress.done();
    };
  }, []);

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return <>{children}</>;
}
