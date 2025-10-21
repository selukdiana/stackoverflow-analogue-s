import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  handleNextClick: () => void;
  handlePrevClick: () => void;
  totalPages: number;
}
export const Pagination = ({
  currentPage,
  handleNextClick,
  handlePrevClick,
  totalPages,
}: PaginationProps) => {
  return (
    <div className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={handlePrevClick}
        className={styles.btn}
      >
        {'<'}
      </button>
      <span>{currentPage}</span>
      <button
        disabled={currentPage === totalPages - 1}
        onClick={handleNextClick}
        className={styles.btn}
      >
        {'>'}
      </button>
    </div>
  );
};
