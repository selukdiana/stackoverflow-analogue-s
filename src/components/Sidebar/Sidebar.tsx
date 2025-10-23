import classNames from 'classnames';
import { Link } from 'react-router';
import { FaHouse } from 'react-icons/fa6';
import { FaRegUserCircle, FaRegFile } from 'react-icons/fa';
import { TbFileStack } from 'react-icons/tb';
import { LuMessageCircleQuestion, LuUsersRound } from 'react-icons/lu';

import styles from './Sidebar.module.scss';
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
  active: boolean;
}
export const Sidebar = ({ active }: SidebarProps) => {
  const { status, user } = useAppSelector((state) => state.auth);

  const sidebarClasses = classNames(styles.sidebar, active && styles.active);
  return (
    <div className={sidebarClasses}>
      {status === 'authorized' && (
        <h3 className={styles.username}>{user?.username}</h3>
      )}

      <Link to="/" className={styles.item}>
        <FaHouse />
        Home
      </Link>
      {status === 'authorized' && (
        <>
          <Link to={`/account/${user?.id}`} className={styles.item}>
            <FaRegUserCircle />
            My Account
          </Link>
          <Link to="/snippet/new" className={styles.item}>
            <FaRegFile />
            Post snippet
          </Link>
          <Link
            to={{ pathname: '/snippets', search: `?userId=${user?.id}` }}
            className={styles.item}
          >
            <TbFileStack />
            My snippets
          </Link>
          <Link to="/questions" className={styles.item}>
            <LuMessageCircleQuestion />
            Questions
          </Link>
          <Link to="/users" className={styles.item}>
            <LuUsersRound />
            Users
          </Link>
        </>
      )}
    </div>
  );
};
