import React from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
}

export const Button = ({ children }: ButtonProps) => {
  return (
    <button className={styles.button} type="submit">
      {children}
    </button>
  );
};
