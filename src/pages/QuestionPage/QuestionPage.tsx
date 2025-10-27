import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, type FormEvent } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

import styles from './QuestionPage.module.scss';
import { Form } from '../../components/Form';
import { useForm } from '../../hooks';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import {
  createQuestion,
  editQuestion,
  getQuestion,
} from '../../store/slices/currentQuestionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const QuestionPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const mode = id ? 'edit' : 'create';
  const question = useAppSelector((state) => state.currentQuestion);

  const {
    values: questionData,
    handleChange: handleQuestionInputChange,
    reset,
  } = useForm(question);

  const isSubmitBtnDisabled =
    !questionData.title ||
    !questionData.description ||
    !questionData.attachedCode;

  const handleQuestionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'create') {
      await dispatch(createQuestion(questionData));
    } else if (mode === 'edit') {
      if (!id) return;
      await dispatch(editQuestion({ question: questionData, id }));
    }
    navigate('/questions');
  };

  useEffect(() => {
    reset(question);
  }, [question, reset]);

  useEffect(() => {
    if (mode === 'create') {
      reset({ title: '', description: '', attachedCode: '' });
      return;
    }
    if (!id) return;
    dispatch(getQuestion(id));
  }, [mode, dispatch, id, reset]);

  return (
    <div className={styles.questionContainer}>
      <Form handleFormSubmit={handleQuestionSubmit}>
        <Input
          label="Title"
          type="text"
          name="title"
          onChange={handleQuestionInputChange}
          value={questionData.title}
        />
        <Input
          label="Description"
          type="text"
          name="description"
          onChange={handleQuestionInputChange}
          value={questionData.description}
        />
        <CodeEditor
          value={questionData.attachedCode}
          placeholder={`Please enter code.`}
          onChange={handleQuestionInputChange}
          name="attachedCode"
          padding={15}
          style={{
            backgroundColor: '#f1eded',
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            borderRadius: '5px',
            marginBottom: '20px',
            color: 'black',
          }}
        />
        <div className={styles.btn}>
          <Button disabled={isSubmitBtnDisabled}>Submit</Button>
        </div>
      </Form>
    </div>
  );
};
