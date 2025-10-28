import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Snippet } from '../../components/Snippet';
import { getAllSnippets } from '../../store/slices/snippetsSlice';
import styles from './HomePage.module.scss';
import { Pagination } from '../../components/Pagination';
import { checkAuth } from '../../store/slices/authSlice';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const userId = searchParams.get('userId');
  const {
    isLoading,
    error,
    data: snippets,
    totalPages,
  } = useAppSelector((state) => state.snippets);

  const handleNextPageClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', `${+page + 1}`);
      return params;
    });
  };

  const handlePrevPageClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', `${+page - 1}`);
      return params;
    });
  };

  useEffect(() => {
    dispatch(getAllSnippets({ page: +page, userId }));
  }, [page, dispatch, userId]);

  useEffect(() => {
    if (userId) return;
    dispatch(checkAuth());
  }, [dispatch, userId]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <main className={styles.homePage}>
      {snippets.map((snippet) => {
        return <Snippet {...snippet} key={snippet.id} />;
      })}
      <Pagination
        currentPage={+page}
        handleNextClick={handleNextPageClick}
        handlePrevClick={handlePrevPageClick}
        totalPages={totalPages}
      />
    </main>
  );
};
