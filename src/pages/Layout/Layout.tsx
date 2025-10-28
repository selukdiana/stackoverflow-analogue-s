import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import styles from './Layout.module.scss';
import { Sidebar } from '../../components/Sidebar';
import { Burger } from '../../components/Burger';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const status = useAppSelector((state) => state.auth.status);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleBurgerClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <Burger
                onBurgerClick={handleBurgerClick}
                active={isSidebarOpen}
                ref={burgerRef}
              />
              <Link to={'/'}>
                <h1 className={styles.logo}>Stackoverflow</h1>
              </Link>
            </div>
            <div className={styles.headerRight}>
              {status === 'authorized' && (
                <a className={styles.headerLink} onClick={handleLogout}>
                  Logout
                </a>
              )}
              {status === 'unauthorized' && (
                <>
                  <Link to="/login" className={styles.headerLink}>
                    Login
                  </Link>
                  <Link to="/register" className={styles.headerLink}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <Sidebar
        active={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        burgerRef={burgerRef}
      />
      <div className={styles.content}>
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
