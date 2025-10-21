import React from 'react';
import { Link } from 'react-router';

import styles from './FormLink.module.scss';

interface FormLinkProps {
  to: string;
  children: string;
}
export const FormLink = ({ to, children }: FormLinkProps) => {
  return (
    <div className={styles.link}>
      <Link to={to}>{children}</Link>
    </div>
  );
};
