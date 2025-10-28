import { useNavigate, useSearchParams } from 'react-router';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getQuestions } from '../../store/slices/questionsSlice';
import { Pagination } from '../../components/Pagination';
import { Question } from '../../components/Question';
import styles from './QuestionsPage.module.scss';

export const QuestionsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;

  const {
    totalPages,
    data: questions,
    isLoading,
    error,
  } = useAppSelector((state) => state.questions);

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
    dispatch(getQuestions(+page));
  }, [page, dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <button onClick={() => navigate('/question')} className={styles.newBtn}>
        + New question
      </button>
      {questions.map((question) => (
        <Question question={question} key={question.id} />
      ))}
      <Pagination
        currentPage={+page}
        handleNextClick={handleNextPageClick}
        handlePrevClick={handlePrevPageClick}
        totalPages={totalPages}
      />
    </>
  );
};
