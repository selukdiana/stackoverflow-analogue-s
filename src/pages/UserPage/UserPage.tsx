import { useParams } from 'react-router';
import { useEffect } from 'react';

import { UserInfo } from '../../components/UserInfo';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserStatistic } from '../../store/slices/accountSlice';

export const UserPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const {
    data: user,
    isLoading,
    error,
  } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserStatistic(userId));
  }, [userId, dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    user && (
      <>
        <UserInfo {...user} />
      </>
    )
  );
};
