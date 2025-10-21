import { useParams } from 'react-router';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getSnippet } from '../../store/slices/currentSnippetSlice';
import { Snippet } from '../../components/Snippet';

export const SnippetPage = () => {
  const { snippetId } = useParams();
  const dispatch = useAppDispatch();

  const { snippet, status } = useAppSelector((state) => state.currentSnippet);

  useEffect(() => {
    if (snippetId) {
      dispatch(getSnippet(snippetId));
    }
  }, [snippetId, dispatch]);

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'rejected') return <p>Error!</p>;
  return (
    <>
      <Snippet {...snippet} />
    </>
  );
};
