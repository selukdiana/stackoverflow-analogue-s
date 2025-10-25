import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Snippet } from '../../components/Snippet';
import {
  getAllSnippets,
  setNextPage,
  setPrevPage,
} from '../../store/slices/snippetsSlice';
import styles from './HomePage.module.scss';
import { Pagination } from '../../components/Pagination';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const {
    status,
    data: snippets,
    currentPage,
    totalPages,
  } = useAppSelector((state) => state.snippets);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const toNextPage = () => {
    dispatch(setNextPage());
  };

  const toPrevPage = () => {
    dispatch(setPrevPage());
  };

  useEffect(() => {
    dispatch(getAllSnippets({ page: currentPage, userId }));
  }, [currentPage, dispatch, userId]);

  return (
    <main className={styles.homePage}>
      {status === 'pending' && 'loading'}
      {status === 'fullfilled' &&
        snippets.map((snippet) => {
          return <Snippet {...snippet} key={snippet.id} source="list" />;
        })}
      {status === 'fullfilled' && (
        <Pagination
          currentPage={currentPage}
          handleNextClick={toNextPage}
          handlePrevClick={toPrevPage}
          totalPages={totalPages}
        />
      )}
    </main>
  );
};
