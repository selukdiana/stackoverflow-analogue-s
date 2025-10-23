import { useNavigate } from 'react-router';

import type { User } from '../../store/types';
import styles from './UserItem.module.scss';

export const UserItem = ({ id, username }: User) => {
  const navigate = useNavigate();
  const handleUserClick = () => {
    navigate(`/user/${id}`);
  };
  return (
    <li className={styles.user} onClick={handleUserClick}>
      {username}
    </li>
  );
};
