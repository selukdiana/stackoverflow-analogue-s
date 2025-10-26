import classNames from 'classnames';
import type { RefObject } from 'react';

import styles from './Burger.module.scss';

interface BurgerProps {
  onBurgerClick: () => void;
  active: boolean;
  ref: RefObject<HTMLButtonElement | null>;
}
export const Burger = ({
  onBurgerClick: handleClick,
  active,
  ref,
}: BurgerProps) => {
  const burgerMenuClasses = classNames(
    styles.burgerMenu,
    active && styles.active,
  );
  return (
    <button
      className={burgerMenuClasses}
      onClick={() => handleClick()}
      ref={ref}
    >
      <span className={styles.burgerLine}></span>
      <span className={styles.burgerLine}></span>
      <span className={styles.burgerLine}></span>
    </button>
  );
};
