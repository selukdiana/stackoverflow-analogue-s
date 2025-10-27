import classNames from 'classnames';
import { Link } from 'react-router';
import { FaHouse } from 'react-icons/fa6';
import { FaRegUserCircle, FaRegFile } from 'react-icons/fa';
import { TbFileStack } from 'react-icons/tb';
import { LuMessageCircleQuestion, LuUsersRound } from 'react-icons/lu';
import { useEffect, useRef, type RefObject } from 'react';

import styles from './Sidebar.module.scss';
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
  active: boolean;
  onClose: () => void;
  burgerRef: RefObject<HTMLButtonElement | null>;
}
export const Sidebar = ({ active, onClose, burgerRef }: SidebarProps) => {
  const { status, user } = useAppSelector((state) => state.auth);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sidebarClasses = classNames(styles.sidebar, active && styles.active);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (burgerRef.current?.contains(e.target as Node)) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, burgerRef]);

  return (
    <div className={sidebarClasses} ref={sidebarRef}>
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
          <Link
            to={{ pathname: '/questions', search: `page=1` }}
            className={styles.item}
          >
            <LuMessageCircleQuestion />
            Questions
          </Link>
          <Link
            to={{ pathname: '/users', search: `page=1` }}
            className={styles.item}
          >
            <LuUsersRound />
            Users
          </Link>
        </>
      )}
    </div>
  );
};
