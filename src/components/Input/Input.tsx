import { type ChangeEvent } from 'react';

import styles from './Input.module.scss';

interface InputProps {
  label: string;
  type: 'text' | 'password' | 'email';
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const Input = ({ label, type, onChange, name, value }: InputProps) => {
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
    </div>
  );
};
