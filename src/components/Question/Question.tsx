import { useNavigate } from 'react-router';

import type { Question as QuestionType } from '../../store/types';
import styles from './Question.module.scss';

interface QuestionProps {
  question: QuestionType;
}

export const Question = ({
  question: { title, user, description, id },
}: QuestionProps) => {
  const navigate = useNavigate();
  const handleQuestionClick = () => {
    navigate(`/questions/${id}`);
  };
  return (
    <div className={styles.question} onClick={handleQuestionClick}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.user}>{user.username}</span>
      <p>{description}</p>
    </div>
  );
};
