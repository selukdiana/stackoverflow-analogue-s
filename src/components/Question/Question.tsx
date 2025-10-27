import { useNavigate } from 'react-router';

import type { Question as QuestionType } from '../../store/types';
import styles from './Question.module.scss';
import { Button } from '../Button';
import { useAppSelector } from '../../store/hooks';

interface QuestionProps {
  question: QuestionType;
}

export const Question = ({
  question: { title, user, description, id },
}: QuestionProps) => {
  const navigate = useNavigate();

  const userId = useAppSelector((state) => state.auth.user?.id);

  //   const handleQuestionClick = () => {
  //     navigate(`/questions/${id}`);
  //   };

  const handleEditBtnClick = () => {
    navigate({ pathname: '/question', search: `?id=${id}` });
  };
  return (
    <div className={styles.question}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.user}>{user.username}</span>
      <p>{description}</p>
      {userId === user.id && (
        <div className={styles.btn}>
          <Button handleClick={handleEditBtnClick}>Edit</Button>
        </div>
      )}
    </div>
  );
};
