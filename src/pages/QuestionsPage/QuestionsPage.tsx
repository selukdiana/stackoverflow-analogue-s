import { useSearchParams } from 'react-router';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getQuestions } from '../../store/slices/questionsSlice';
import { Pagination } from '../../components/Pagination';
import { Question } from '../../components/Question';

export const QuestionsPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;

  const totalPages = useAppSelector((state) => state.questions.totalPages);
  const questions = useAppSelector((state) => state.questions.data);

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

  return (
    <>
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
