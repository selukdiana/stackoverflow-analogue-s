import { type FormEvent, type ReactNode } from 'react';

import styles from './Form.module.scss';

interface FormProps {
  children: ReactNode;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export const Form = ({ children, handleFormSubmit, error }: FormProps) => {
  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
};
