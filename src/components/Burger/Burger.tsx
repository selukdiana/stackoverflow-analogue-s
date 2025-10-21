import React from 'react';
import classNames from 'classnames';

import styles from './Burger.module.scss';

interface BurgerProps {
  onBurgerClick: () => void;
  active: boolean;
}
export const Burger = ({ onBurgerClick: handleClick, active }: BurgerProps) => {
  const burgerMenuClasses = classNames(
    styles.burgerMenu,
    active && styles.active,
  );
  return (
    <button className={burgerMenuClasses} onClick={() => handleClick()}>
      <span className={styles.burgerLine}></span>
      <span className={styles.burgerLine}></span>
      <span className={styles.burgerLine}></span>
    </button>
  );
};
