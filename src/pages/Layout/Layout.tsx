import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

import styles from './Layout.module.scss';
import { Sidebar } from '../../components/Sidebar';
import { Burger } from '../../components/Burger';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { resetStore } from '../../store/rootReducer';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const status = useAppSelector((state) => state.auth.status);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    await dispatch(resetStore());
    navigate('/login');
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
