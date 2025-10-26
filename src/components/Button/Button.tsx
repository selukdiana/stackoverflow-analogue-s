import { type MouseEvent } from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const Button = ({
  children,
  handleClick,
  disabled = false,
}: ButtonProps) => {
  const btnClasses = classNames(styles.button, disabled && styles.disabled);
  return (
    <button
      className={btnClasses}
      type={handleClick ? 'button' : 'submit'}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
