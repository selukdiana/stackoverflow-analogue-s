import { Navigate, Outlet } from 'react-router';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuth } from '../../store/slices/authSlice';

export const PrivateRoutes = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    dispatch(checkAuth());
  });

  return status === 'authorized' ? <Outlet /> : <Navigate to={'/login'} />;
};
