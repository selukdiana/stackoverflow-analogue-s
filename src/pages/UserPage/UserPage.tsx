import { useParams } from 'react-router';
import { useEffect } from 'react';

import { UserInfo } from '../../components/UserInfo';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserStatistic } from '../../store/slices/accountSlice';

export const UserPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const user = useAppSelector((state) => state.account.data);

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserStatistic(userId));
  }, [userId, dispatch]);
  return (
    user && (
      <>
        <UserInfo {...user} />
      </>
    )
  );
};
