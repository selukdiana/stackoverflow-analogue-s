import { Navigate, Outlet } from 'react-router';
import { useEffect } from 'react';

import { useAppSelector } from '../../store/hooks';

export const PrivateRoutes = () => {
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    // dispatch(checkAuth());
  });

  return status === 'authorized' ? <Outlet /> : <Navigate to={'/login'} />;
};
