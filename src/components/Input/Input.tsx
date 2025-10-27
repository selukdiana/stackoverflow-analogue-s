import { type ChangeEvent } from 'react';

import styles from './Input.module.scss';

interface InputProps {
  label: string;
  type: 'text' | 'password' | 'email';
  name: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const Input = ({
  label,
  type,
  onChange,
  name,
  value,
  error,
}: InputProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        onChange={onChange}
        name={name}
        value={value}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
