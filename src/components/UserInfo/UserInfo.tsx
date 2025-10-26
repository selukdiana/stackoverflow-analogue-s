import { FaRegTrashAlt } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetStore } from '../../store/rootReducer';
import { deleteUser } from '../../store/slices/accountSlice';
import type { Account } from '../../store/types';
import { StatisticItem } from '../StatisticItem';
import styles from './UserInfo.module.scss';

export const UserInfo = ({
  username,
  role,
  id: userId,
  statistic,
}: Account) => {
  const dispatch = useAppDispatch();
  const handleDeleteAccountClick = async () => {
    await dispatch(deleteUser());
    dispatch(resetStore());
  };

  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const isCurrentUser = currentUserId === userId;
  return (
    <div className={styles.user}>
      <div className={styles.userInfo}>
        <h4>{username}</h4>
        <span>Id: {userId}</span>
        <span>Role: {role}</span>
        {isCurrentUser && (
          <button
            className={styles.deleteBtn}
            onClick={handleDeleteAccountClick}
          >
            <FaRegTrashAlt /> DELETE
          </button>
        )}
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
  );
};
