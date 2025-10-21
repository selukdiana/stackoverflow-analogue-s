import SyntaxHighlighter from 'react-syntax-highlighter';
import { stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaUser } from 'react-icons/fa';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { FaRegComments } from 'react-icons/fa6';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

import styles from './Snippet.module.scss';
import {
  setSnippetMark,
  type Snippet as SnippetType,
} from '../../store/slices/snippetsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

type SnippetProps = SnippetType;

export const Snippet = ({
  code,
  language,
  user,
  marks,
  comments,
  id,
}: SnippetProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, user: currentUser } = useAppSelector((state) => state.auth);
  const isAuthorized = status === 'authorized';

  const likesCount = marks.filter((mark) => mark.type === 'like').length;
  const dislikesCount = marks.filter((mark) => mark.type === 'dislike').length;
  const commentsCount = comments.length;

  let markType: 'like' | 'dislike' | null = null;

  if (isAuthorized) {
    if (
      marks.some(
        (mark) => mark.type === 'like' && mark.user.id === currentUser?.id,
      )
    ) {
      markType = 'like';
    }
    if (
      marks.some(
        (mark) => mark.type === 'dislike' && mark.user.id === currentUser?.id,
      )
    ) {
      markType = 'dislike';
    }
  }

  const iLikeClasses = classNames(
    styles.iLike,
    markType === 'like' ? styles.clicked : isAuthorized && styles.active,
  );
  const iDislikeClasses = classNames(
    styles.iDislike,
    markType === 'dislike' ? styles.clicked : isAuthorized && styles.active,
  );
  const iCommentClasses = classNames(
    styles.iComment,
    isAuthorized && styles.active,
  );

  const handleLikeClick = () => {
    dispatch(
      setSnippetMark({
        mark: 'like',
        id,
      }),
    );
  };

  const handleDislikeClick = () => {
    dispatch(
      setSnippetMark({
        mark: 'dislike',
        id,
      }),
    );
  };

  const handleCommentClick = () => {
    navigate(`/snippet/${id}`);
  };

  return (
    <div className={styles.snippet}>
      <div className={styles.snippetHeader}>
        <div className={styles.userInfo}>
          <FaUser className={styles.iUser} />
          {user.username}
        </div>
        <span className={styles.language}>{language}</span>
      </div>
      <SyntaxHighlighter language={language} style={stackoverflowLight}>
        {code}
      </SyntaxHighlighter>
      <div className={styles.snippetInfo}>
        <div className={styles.snippetLikesDislikes}>
          <div className={styles.infoItem}>
            <AiOutlineLike className={iLikeClasses} onClick={handleLikeClick} />
            <span>{likesCount}</span>
          </div>
          <div className={styles.infoItem}>
            <AiOutlineDislike
              className={iDislikeClasses}
              onClick={handleDislikeClick}
            />
            <span>{dislikesCount}</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <FaRegComments
            className={iCommentClasses}
            onClick={handleCommentClick}
          />
          <span>{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};
