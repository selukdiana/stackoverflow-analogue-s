import styles from './StatisticItem.module.scss';

interface StatisticItemProps {
  label: string;
  value?: number;
}

export const StatisticItem = ({ label, value }: StatisticItemProps) => {
  return (
    <li className={styles.item}>
      <span className={styles.label}>{label}: </span>
      {value}
    </li>
  );
};
