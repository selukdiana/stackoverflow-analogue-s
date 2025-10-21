import { useParams } from 'react-router';
import { useEffect } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserStatistic } from '../../store/slices/accountSlice';
import styles from './AccountPage.module.scss';
import { StatisticItem } from '../../components/StatisticItem';

export const AccountPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const { status, data: accountInfo } = useAppSelector(
    (state) => state.account,
  );

  const { username, role, statistic } = accountInfo || {};

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserStatistic(userId));
  }, [userId, dispatch]);

  if (status === 'pending') return 'Loading...';
  if (status === 'rejected') return 'Error';
  return (
    <>
      <h3 className={styles.username}>
        Welcome, <span>{username}</span>
      </h3>
      <div className={styles.user}>
        <div className={styles.userInfo}>
          <h4>{username}</h4>
          <span>Id: {userId}</span>
          <span>Role: {role}</span>
          <button className={styles.deleteBtn}>
            <FaRegTrashAlt /> DELETE
          </button>
        </div>
        <ul className={styles.userStatistic}>
          <StatisticItem label="Rating" value={statistic?.rating} />
          <StatisticItem label="Snippets" value={statistic?.snippetsCount} />
          <StatisticItem label="Comments" value={statistic?.commentsCount} />
          <StatisticItem label="Likes" value={statistic?.likesCount} />
          <StatisticItem label="Dislikes" value={statistic?.dislikesCount} />
          <StatisticItem label="Questions" value={statistic?.questionsCount} />
          <StatisticItem
            label="Correct Answers"
            value={statistic?.correctAnswersCount}
          />
          <StatisticItem
            label="Regular Answers"
            value={statistic?.regularAnswersCount}
          />
        </ul>
      </div>
    </>
  );
};
