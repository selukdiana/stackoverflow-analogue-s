import { useParams } from 'react-router';
import { useEffect, type FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addComment,
  getSnippet,
  sendComment,
} from '../../store/slices/currentSnippetSlice';
import { Snippet } from '../../components/Snippet';
import socket from '../../socket.ts';
import { type Comment as CommentType } from '../../store/types.ts';
import { Form } from '../../components/Form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useForm } from '../../hooks.ts';
import styles from './SnippetPage.module.scss';
import { Comment } from '../../components/Comment';

export const SnippetPage = () => {
  const dispatch = useAppDispatch();
  const { snippetId } = useParams();
  const { snippet, status } = useAppSelector((state) => state.currentSnippet);
  const comments = snippet.comments;
  const {
    handleChange: handleNewCommentChange,
    values: newCommentFormValues,
    reset,
  } = useForm({ newComment: '' });

  const handleSendCommentBtnClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(sendComment(newCommentFormValues.newComment));
    reset({ newComment: '' });
  };

  useEffect(() => {
    if (snippetId) {
      dispatch(getSnippet(snippetId));
    }
    const handleNew = (comment: CommentType) => {
      dispatch(addComment(comment));
    };
    socket.on('newComment', handleNew);
    return () => {
      socket.off('newComment', handleNew);
    };
  }, [snippetId, dispatch]);

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'rejected') return <p>Error!</p>;
  return (
    <div className={styles.snippetPage}>
      <Snippet {...snippet} />
      <div className={styles.newCommentForm}>
        <Form handleFormSubmit={handleSendCommentBtnClick}>
          <Input
            label="New comment:"
            type="text"
            name="newComment"
            value={newCommentFormValues.newComment}
            onChange={handleNewCommentChange}
          />
          <div className={styles.sendBtn}>
            <Button>Send</Button>
          </div>
        </Form>
      </div>
      {comments.length &&
        comments
          .map((comment) => <Comment comment={comment} key={comment.id} />)
          .reverse()}
    </div>
  );
};
