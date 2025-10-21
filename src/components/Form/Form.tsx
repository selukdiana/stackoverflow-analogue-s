import React, { FormEvent, ReactNode } from 'react';

import styles from './Form.module.scss';

interface FormProps {
  children: ReactNode;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ children, handleFormSubmit }: FormProps) => {
  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      {children}
    </form>
  );
};
