import React from 'react';
import { Outlet } from 'react-router';

import { useAppSelector } from '../../store/hooks';

export const PrivateRoutes = () => {
  const status = useAppSelector((state) => state.auth.status);
  return <>{status === 'authorized' && <Outlet />}</>;
};
