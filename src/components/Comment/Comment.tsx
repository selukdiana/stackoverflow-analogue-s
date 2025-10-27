import { type Comment as CommentType } from '../../store/types';
import styles from './Comment.module.scss';

interface CommentProps {
  comment: CommentType;
}
export const Comment = ({ comment: { content, user } }: CommentProps) => {
  return (
    <div className={styles.comment}>
      <h4>{user.username}</h4>
      <p>{content}</p>
    </div>
  );
};
