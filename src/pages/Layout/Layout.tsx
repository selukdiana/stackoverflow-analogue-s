import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';

import styles from './Layout.module.scss';
import { Sidebar } from '../../components/Sidebar';
import { Burger } from '../../components/Burger';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const status = useAppSelector((state) => state.auth.status);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate('/login'));
  };

  const handleBurgerClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className="container" style={{ height: '100%' }}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <Burger
                onBurgerClick={handleBurgerClick}
                active={isSidebarOpen}
              />
              <Link to={'/'}>
                <h1 className={styles.logo}>Stackoverflow</h1>
              </Link>
            </div>
            <div className={styles.headerRight}>
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
              {status === 'authorized' && (
                <a className={styles.headerLink} onClick={handleLogout}>
                  Logout
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      <Sidebar active={isSidebarOpen} />
      <div className={styles.content}>
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
