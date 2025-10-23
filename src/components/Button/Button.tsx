import { type MouseEvent } from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ children, handleClick }: ButtonProps) => {
  return (
    <button
      className={styles.button}
      type={handleClick ? 'button' : 'submit'}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
